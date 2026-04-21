// ============================================================
// VMS App Context - Global State Management
// ============================================================

import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from 'react';
import type {
  Company,
  Department,
  Designation,
  Employee,
  Purpose,
  VisitorFormData,
  VisitorDetailNextFormData,
  VisitorCardData,
  Toast
} from '../types/index.ts';

// ============================================================
// State Types
// ============================================================

interface AppState {
  // Dropdown data
  companies: Company[];
  departments: Department[];
  designations: Designation[];
  employees: Employee[];
  purposes: Purpose[];
  
  // Selected company for filtering
  selectedCompanyId: number | null;
  
  // Visitor form data
  visitorData: VisitorFormData;
  visitorDetailNextData: VisitorDetailNextFormData;
  visitorPhoto: string | null;
  
  // Generated card data
  cardData: VisitorCardData | null;
  
  // OTP verification
  isPhoneVerified: boolean;
  phoneNumber: string;
  
  // Loading states
  isLoading: boolean;
  
  // Toasts
  toasts: Toast[];
  
  // Walkthrough completed
  walkthroughCompleted: boolean;
}

// ============================================================
// Initial State
// ============================================================

const initialVisitorData: VisitorFormData = {
  firstName: '',
  lastName: '',
  phone: '',
  gender: '',
  email: '',
  companyId: null,
  companyName: '',
};

const initialVisitorDetailNextData: VisitorDetailNextFormData = {
  departmentId: null,
  departmentName: '',
  designationId: null,
  designationName: '',
  employeeId: null,
  employeeName: '',
  aadhaarNo: '',
  purposeId: null,
  purposeName: '',
  address: '',
  visitorCompanyName: '',
};

const initialState: AppState = {
  companies: [],
  departments: [],
  designations: [],
  employees: [],
  purposes: [],
  selectedCompanyId: null,
  visitorData: initialVisitorData,
  visitorDetailNextData: initialVisitorDetailNextData,
  visitorPhoto: null,
  cardData: null,
  isPhoneVerified: false,
  phoneNumber: '',
  isLoading: false,
  toasts: [],
  walkthroughCompleted: localStorage.getItem('walkthroughCompleted') === 'true',
};

// ============================================================
// Action Types
// ============================================================

type AppAction =
  | { type: 'SET_COMPANIES'; payload: Company[] }
  | { type: 'SET_DEPARTMENTS'; payload: Department[] }
  | { type: 'SET_DESIGNATIONS'; payload: Designation[] }
  | { type: 'SET_EMPLOYEES'; payload: Employee[] }
  | { type: 'SET_PURPOSES'; payload: Purpose[] }
  | { type: 'SET_SELECTED_COMPANY_ID'; payload: number | null }
  | { type: 'SET_VISITOR_DATA'; payload: Partial<VisitorFormData> }
  | { type: 'SET_VISITOR_DETAIL_NEXT_DATA'; payload: Partial<VisitorDetailNextFormData> }
  | { type: 'SET_VISITOR_PHOTO'; payload: string | null }
  | { type: 'SET_CARD_DATA'; payload: VisitorCardData | null }
  | { type: 'SET_PHONE_VERIFIED'; payload: boolean }
  | { type: 'SET_PHONE_NUMBER'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'SET_WALKTHROUGH_COMPLETED'; payload: boolean }
  | { type: 'RESET_VISITOR_FORM' };

// ============================================================
// Reducer
// ============================================================

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_COMPANIES':
      return { ...state, companies: action.payload };
    
    case 'SET_DEPARTMENTS':
      return { ...state, departments: action.payload };
    
    case 'SET_DESIGNATIONS':
      return { ...state, designations: action.payload };
    
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.payload };
    
    case 'SET_PURPOSES':
      return { ...state, purposes: action.payload };
    
    case 'SET_SELECTED_COMPANY_ID':
      return { ...state, selectedCompanyId: action.payload };
    
    case 'SET_VISITOR_DATA':
      return { 
        ...state, 
        visitorData: { ...state.visitorData, ...action.payload } 
      };
    
    case 'SET_VISITOR_DETAIL_NEXT_DATA':
      return { 
        ...state, 
        visitorDetailNextData: { ...state.visitorDetailNextData, ...action.payload } 
      };
    
    case 'SET_VISITOR_PHOTO':
      return { ...state, visitorPhoto: action.payload };
    
    case 'SET_CARD_DATA':
      return { ...state, cardData: action.payload };
    
    case 'SET_PHONE_VERIFIED':
      return { ...state, isPhoneVerified: action.payload };
    
    case 'SET_PHONE_NUMBER':
      return { ...state, phoneNumber: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    
    case 'REMOVE_TOAST':
      return { 
        ...state, 
        toasts: state.toasts.filter(t => t.id !== action.payload) 
      };
    
    case 'SET_WALKTHROUGH_COMPLETED':
      localStorage.setItem('walkthroughCompleted', String(action.payload));
      return { ...state, walkthroughCompleted: action.payload };
    
    case 'RESET_VISITOR_FORM':
      return {
        ...state,
        visitorData: initialVisitorData,
        visitorDetailNextData: initialVisitorDetailNextData,
        visitorPhoto: null,
        cardData: null,
        isPhoneVerified: false,
        phoneNumber: '',
      };
    
    default:
      return state;
  }
}

// ============================================================
// Context
// ============================================================

interface AppContextType {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ============================================================
// Provider Component
// ============================================================

interface AppProviderProps {
  children: ReactNode;
}

const LOCAL_STORAGE_KEY = 'vms_app_state';

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState, (defaultState) => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          // Always reset transient UI states
          isLoading: false,
          toasts: [],
          // Ensure walkthrough state logic is consistent
          walkthroughCompleted: parsed.walkthroughCompleted ?? defaultState.walkthroughCompleted,
        };
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
    }
    return defaultState;
  });

  // Save specific state parts to localStorage
  useEffect(() => {
    const stateToSave = {
      visitorData: state.visitorData,
      visitorDetailNextData: state.visitorDetailNextData,
      visitorPhoto: state.visitorPhoto,
      cardData: state.cardData,
      isPhoneVerified: state.isPhoneVerified,
      phoneNumber: state.phoneNumber,
      selectedCompanyId: state.selectedCompanyId,
      walkthroughCompleted: state.walkthroughCompleted,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [
    state.visitorData,
    state.visitorDetailNextData,
    state.visitorPhoto,
    state.cardData,
    state.isPhoneVerified,
    state.phoneNumber,
    state.selectedCompanyId,
    state.walkthroughCompleted,
  ]);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// ============================================================
// Custom Hook
// ============================================================

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// ============================================================
// Helper Hooks
// ============================================================

export function useToast() {
  const { dispatch } = useApp();
  
  const showToast = (type: Toast['type'], message: string, duration = 3000) => {
    const id = Date.now().toString();
    dispatch({ type: 'ADD_TOAST', payload: { id, type, message, duration } });
    
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, duration);
  };
  
  return {
    success: (message: string) => showToast('success', message),
    error: (message: string) => showToast('error', message),
    info: (message: string) => showToast('info', message),
    warning: (message: string) => showToast('warning', message),
  };
}

export function useLoading() {
  const { state, dispatch } = useApp();
  
  return {
    isLoading: state.isLoading,
    setLoading: (loading: boolean) => 
      dispatch({ type: 'SET_LOADING', payload: loading }),
  };
}
