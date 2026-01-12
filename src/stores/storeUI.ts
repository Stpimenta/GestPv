import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {

    state: () => ({
        sidebarOpen: false,
    }),

    actions: {

        toggleSideBar(){
            this.sidebarOpen = !this.sidebarOpen;
        },
    
        closeSideBar(){
            this.sidebarOpen = false;
        },
    }
});