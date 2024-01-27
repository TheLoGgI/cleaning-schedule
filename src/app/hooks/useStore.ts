import { create } from 'zustand'

type StoreType = {
    editMode: boolean
    changeEditMode: (mode: boolean) => void
    toggleEditMode: () => void
}

export const useStore = create<StoreType>((set, get) => ({
  editMode: false,
  changeEditMode: (mode: boolean) => set(() => ({ editMode: mode })),
  toggleEditMode: () => {
    const curretMode = get().editMode

    if (curretMode) {
        set(() => ({ editMode: false })); 
        return
    }
     
    set(() => ({ editMode: true }))
  },
}))