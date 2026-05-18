import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface KBDocument {
  id?: string;
  title: string;
  content: string;
  type: 'dept' | 'rule' | 'report' | 'shared';
  department: string;
  authorId: string;
  createdAt?: Timestamp;
}

export const knowledgeService = {
  getDocuments: (type?: string, callback?: (docs: KBDocument[]) => void) => {
    const path = 'documents';
    try {
      let q = query(collection(db, path));
      if (type) {
        q = query(q, where('type', '==', type));
      }

      if (callback) {
        return onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as KBDocument));
          callback(docs);
        }, (error) => handleFirestoreError(error, OperationType.GET, path));
      }

      return getDocs(q).then(snapshot => 
        snapshot.docs.map(d => ({ id: d.id, ...d.data() } as KBDocument))
      ).catch(error => handleFirestoreError(error, OperationType.GET, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  createDocument: async (docData: Omit<KBDocument, 'id' | 'authorId' | 'createdAt'>) => {
    const path = 'documents';
    if (!auth.currentUser) throw new Error('Must be signed in');
    
    try {
      const fullDoc = {
        ...docData,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      };
      return await addDoc(collection(db, path), fullDoc);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  generateKnowledge: async (prompt: string) => {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': (import.meta as any).env?.VITE_ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: "You are an expert technical writer and AI architect for 'Emblock', an internal company knowledge base. Your goal is to generate extremely high-quality, professional, and accurate technical documentation, logic models, or architectural overviews based on user input. Use professional markdown formatting. Focus on depth and clarity.",
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate knowledge');
      }

      const data = await response.json();
      return data.content?.[0]?.text || '';
    } catch (error) {
      console.error('Generation Error:', error);
      throw error;
    }
  },

  logUsage: async (tokens: number) => {
    const path = 'usage';
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, path), {
        userId: auth.currentUser.uid,
        tokens,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
};
