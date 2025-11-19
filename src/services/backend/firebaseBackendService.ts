/**
 * Firebase Backend Service Implementation
 * Provides cloud synchronization for user data using Firebase Firestore
 */

import { initializeApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  Auth,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  getStorage,
  FirebaseStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

import { BackendService, type UserAuth, type BackendConfig } from './backendService';
import type { UserProfile, SRSItem, SimpleGameHistory, Weakness } from '../../types';

/**
 * Firebase Backend Service
 * Implements full cloud sync functionality with Firebase
 */
export class FirebaseBackendService extends BackendService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private db: Firestore | null = null;
  private storage: FirebaseStorage | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const firebaseConfig: FirebaseOptions = {
        apiKey: this.config.apiKey,
        authDomain: this.config.authDomain,
        projectId: this.config.projectId,
      };

      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.storage = getStorage(this.app);

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      throw new Error('Firebase initialization failed');
    }
  }

  private ensureInitialized(): void {
    if (!this.auth || !this.db || !this.storage) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
  }

  private convertFirebaseUser(user: User): UserAuth {
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || undefined,
      photoURL: user.photoURL || undefined,
      isAnonymous: user.isAnonymous,
    };
  }

  // ==================== Authentication ====================

  async signUp(email: string, password: string): Promise<UserAuth> {
    this.ensureInitialized();
    const userCredential = await createUserWithEmailAndPassword(this.auth!, email, password);
    return this.convertFirebaseUser(userCredential.user);
  }

  async signIn(email: string, password: string): Promise<UserAuth> {
    this.ensureInitialized();
    const userCredential = await signInWithEmailAndPassword(this.auth!, email, password);
    return this.convertFirebaseUser(userCredential.user);
  }

  async signInAnonymously(): Promise<UserAuth> {
    this.ensureInitialized();
    const userCredential = await signInAnonymously(this.auth!);
    return this.convertFirebaseUser(userCredential.user);
  }

  async signOut(): Promise<void> {
    this.ensureInitialized();
    await firebaseSignOut(this.auth!);
  }

  async getCurrentUser(): Promise<UserAuth | null> {
    this.ensureInitialized();
    const user = this.auth!.currentUser;
    return user ? this.convertFirebaseUser(user) : null;
  }

  // ==================== Data Sync ====================

  async syncUserProfile(profile: UserProfile): Promise<void> {
    this.ensureInitialized();
    const user = this.auth!.currentUser;
    if (!user) throw new Error('No authenticated user');

    const profileRef = doc(this.db!, 'userProfiles', user.uid);
    const profileData = {
      ...profile,
      createdAt: Timestamp.fromDate(new Date(profile.createdAt)),
      lastPracticeDate: profile.lastPracticeDate
        ? Timestamp.fromDate(new Date(profile.lastPracticeDate))
        : null,
      updatedAt: Timestamp.now(),
    };

    await setDoc(profileRef, profileData, { merge: true });
  }

  async syncSRSItems(items: SRSItem[]): Promise<void> {
    this.ensureInitialized();
    const user = this.auth!.currentUser;
    if (!user) throw new Error('No authenticated user');

    // Use batch write for better performance
    const batch = writeBatch(this.db!);
    const srsCollectionRef = collection(this.db!, 'userProfiles', user.uid, 'srsItems');

    items.forEach((item) => {
      const itemRef = doc(srsCollectionRef, item.id);
      const itemData = {
        ...item,
        nextReviewDate: Timestamp.fromDate(new Date(item.nextReviewDate)),
        lastReviewDate: item.lastReviewDate
          ? Timestamp.fromDate(new Date(item.lastReviewDate))
          : null,
        createdAt: Timestamp.fromDate(new Date(item.createdAt)),
      };
      batch.set(itemRef, itemData, { merge: true });
    });

    await batch.commit();
  }

  async syncGameHistory(games: SimpleGameHistory[]): Promise<void> {
    this.ensureInitialized();
    const user = this.auth!.currentUser;
    if (!user) throw new Error('No authenticated user');

    const batch = writeBatch(this.db!);
    const gamesCollectionRef = collection(this.db!, 'userProfiles', user.uid, 'games');

    games.forEach((game) => {
      const gameRef = doc(gamesCollectionRef, game.id);
      const gameData = {
        ...game,
        date: Timestamp.fromDate(new Date(game.date)),
      };
      batch.set(gameRef, gameData, { merge: true });
    });

    await batch.commit();
  }

  async syncWeaknesses(weaknesses: Weakness[]): Promise<void> {
    this.ensureInitialized();
    const user = this.auth!.currentUser;
    if (!user) throw new Error('No authenticated user');

    const batch = writeBatch(this.db!);
    const weaknessesRef = collection(this.db!, 'userProfiles', user.uid, 'weaknesses');

    weaknesses.forEach((weakness) => {
      const weaknessRef = doc(weaknessesRef, `${weakness.type}-${weakness.pattern}`);
      const weaknessData = {
        ...weakness,
        lastSeen: Timestamp.fromDate(new Date(weakness.lastSeen)),
      };
      batch.set(weaknessRef, weaknessData, { merge: true });
    });

    await batch.commit();
  }

  // ==================== Data Retrieval ====================

  async fetchUserProfile(uid: string): Promise<UserProfile | null> {
    this.ensureInitialized();

    const profileRef = doc(this.db!, 'userProfiles', uid);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) return null;

    const data = profileSnap.data();
    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      lastPracticeDate: data.lastPracticeDate ? data.lastPracticeDate.toDate() : null,
    } as UserProfile;
  }

  async fetchSRSItems(uid: string): Promise<SRSItem[]> {
    this.ensureInitialized();

    const srsCollectionRef = collection(this.db!, 'userProfiles', uid, 'srsItems');
    const querySnapshot = await getDocs(srsCollectionRef);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        nextReviewDate: data.nextReviewDate.toDate(),
        lastReviewDate: data.lastReviewDate ? data.lastReviewDate.toDate() : null,
        createdAt: data.createdAt.toDate(),
      } as SRSItem;
    });
  }

  async fetchGameHistory(uid: string, limitCount: number = 50): Promise<SimpleGameHistory[]> {
    this.ensureInitialized();

    const gamesRef = collection(this.db!, 'userProfiles', uid, 'games');
    const q = query(gamesRef, orderBy('date', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        date: data.date.toDate(),
      } as SimpleGameHistory;
    });
  }

  async fetchWeaknesses(uid: string): Promise<Weakness[]> {
    this.ensureInitialized();

    const weaknessesRef = collection(this.db!, 'userProfiles', uid, 'weaknesses');
    const q = query(weaknessesRef, orderBy('frequency', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        lastSeen: data.lastSeen.toDate(),
      } as Weakness;
    });
  }

  // ==================== Streak Validation ====================

  async validateStreak(uid: string, currentStreak: number): Promise<boolean> {
    this.ensureInitialized();

    const activityRef = collection(this.db!, 'userProfiles', uid, 'activity');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      activityRef,
      where('date', '>=', Timestamp.fromDate(today)),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.size > 0;
  }

  async recordActivity(uid: string): Promise<void> {
    this.ensureInitialized();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activityRef = doc(this.db!, 'userProfiles', uid, 'activity', today.toISOString());
    await setDoc(activityRef, {
      date: Timestamp.fromDate(today),
      timestamp: Timestamp.now(),
    });
  }

  // ==================== Cloud Storage ====================

  async uploadAvatar(uid: string, imageUri: string): Promise<string> {
    this.ensureInitialized();

    // Convert image URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const avatarRef = ref(this.storage!, `avatars/${uid}/profile.jpg`);
    await uploadBytes(avatarRef, blob);

    return await getDownloadURL(avatarRef);
  }

  async deleteAvatar(uid: string): Promise<void> {
    this.ensureInitialized();

    const avatarRef = ref(this.storage!, `avatars/${uid}/profile.jpg`);
    await deleteObject(avatarRef);
  }
}
