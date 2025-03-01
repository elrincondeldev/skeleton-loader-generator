import { create } from 'zustand';

interface SkeletonState {
  reactComponent: string;
  skeletonCode: string;
  isGenerating: boolean;
  copySuccess: boolean;
  error: string;
  setReactComponent: (component: string) => void;
  setSkeletonCode: (code: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setCopySuccess: (success: boolean) => void;
  setError: (error: string) => void;
  reset: () => void;
}

export const useSkeletonStore = create<SkeletonState>((set) => ({
  reactComponent: '',
  skeletonCode: '',
  isGenerating: false,
  copySuccess: false,
  error: '',
  setReactComponent: (component) => set({ reactComponent: component }),
  setSkeletonCode: (code) => set({ skeletonCode: code }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setCopySuccess: (success) => set({ copySuccess: success }),
  setError: (error) => set({ error }),
  reset: () => set({
    reactComponent: '',
    skeletonCode: '',
    isGenerating: false,
    copySuccess: false,
    error: ''
  })
})); 