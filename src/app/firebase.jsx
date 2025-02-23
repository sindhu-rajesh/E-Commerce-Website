import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, doc, setDoc, addDoc, deleteDoc, getDocs, 
  onSnapshot, query, where 
} from "firebase/firestore";
import { 
  getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword 
} from "firebase/auth";

import toast from 'react-hot-toast';
import { store } from './store/store';
import { loginHandle, logoutHandle } from './store/auth';
import { clearCart } from './store/cart';
import { setProducts } from './store/product';
import { setOrders } from "./store/orders";
import { setAllOrders } from "./store/adminDashboard";

// 🔹 Firebase Configuration (Ensure Correct `.env` Variable Names)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_REACT_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_REACT_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_REACT_APP_API_ID
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 Authentication State Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    store.dispatch(loginHandle(user.email));
  } else {
    store.dispatch(logoutHandle());
  }
});

// 🔹 Fetch Products in Real-Time
onSnapshot(collection(db, 'products'), (snapshot) => {
  const products = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  store.dispatch(setProducts(products));
});

// 🔹 Login Function
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    toast.success("Successfully logged in");
    return userCredential.user;
  } catch (err) {
    toast.error(err.message);
    return null;
  }
};

// 🔹 Logout Function
export const logout = async () => {
  try {
    await signOut(auth);
    toast.success("Successfully logged out");
    return true;
  } catch (err) {
    toast.error(err.message);
    return false;
  }
};

// 🔹 Add Product
export const addProduct = async (data) => {
  try {
    await addDoc(collection(db, 'products'), data);
    toast.success("Product added successfully");
  } catch (err) {
    toast.error(err.message);
  }
};

// 🔹 Update Product
export const updateProduct = async (product, id) => {
  try {
    await setDoc(doc(db, 'products', id), product);
    toast.success("Product updated successfully");
  } catch (err) {
    toast.error(err.message);
  }
};

// 🔹 Delete Product
export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, "products", id));
    toast.success("Product deleted successfully");
  } catch (err) {
    toast.error(err.message);
  }
};

// 🔹 Place Order
export const placeOrder = async (order) => {
  try {
    await addDoc(collection(db, 'orders'), order);
    store.dispatch(clearCart());
    toast.success("Order placed successfully");
  } catch (err) {
    toast.error(err.message);
  }
};

// 🔹 Get Orders for Specific User
export const getMyOrders = async (ownerId) => {
  const q = query(collection(db, 'orders'), where("id", "==", ownerId));
  try {
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({ fireId: doc.id, data: doc.data() }));
    store.dispatch(setOrders(orders));
    return orders;
  } catch (err) {
    toast.error(err.message);
    return [];
  }
};

// 🔹 Get All Orders (Admin)
export const getAllOrders = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const orders = querySnapshot.docs.map(doc => ({ fireId: doc.id, data: doc.data() }));
    store.dispatch(setAllOrders(orders));
    return orders;
  } catch (err) {
    toast.error(err.message);
    return [];
  }
};

// 🔹 Update Order
export const updateOrder = async (order, id) => {
  try {
    await setDoc(doc(db, 'orders', id), order);
    toast.success("Order updated successfully");
  } catch (err) {
    toast.error(err.message);
  }
};
