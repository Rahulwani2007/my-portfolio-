import { create } from "zustand";

type NeuralUIState = {
  typingIntensity: number;      // 0 to 1, increases when typing
  isPasswordActive: boolean;    // true when user is typing passcode, triggers noise
  destabilizeTrigger: boolean;  // true on failed auth, flashes red
  successTrigger: boolean;      // true on successful login, triggers vortex portal
  activeSignupStep: number;     // 0: identity, 1: email, 2: calibration/theme, 3: activation
  selectedTheme: "cyan" | "purple" | "amber";
  cursorGlowColor: string;
  setTypingIntensity: (val: number) => void;
  decayTypingIntensity: () => void;
  setPasswordActive: (active: boolean) => void;
  triggerDestabilize: () => void;
  triggerSuccess: () => void;
  setSignupStep: (step: number) => void;
  setTheme: (theme: "cyan" | "purple" | "amber") => void;
  resetAll: () => void;
};

export const useUIStore = create<NeuralUIState>((set) => ({
  typingIntensity: 0,
  isPasswordActive: false,
  destabilizeTrigger: false,
  successTrigger: false,
  activeSignupStep: 0,
  selectedTheme: "cyan",
  cursorGlowColor: "#63f3ff",

  setTypingIntensity: (val) => set({ typingIntensity: val }),
  decayTypingIntensity: () => set((state) => ({ 
    typingIntensity: Math.max(0, state.typingIntensity - 0.05) 
  })),
  setPasswordActive: (active) => set({ isPasswordActive: active }),
  triggerDestabilize: () => {
    set({ destabilizeTrigger: true });
    setTimeout(() => set({ destabilizeTrigger: false }), 1500);
  },
  triggerSuccess: () => {
    set({ successTrigger: true });
  },
  setSignupStep: (step) => set({ activeSignupStep: step }),
  setTheme: (theme) => {
    let color = "#63f3ff";
    if (theme === "purple") color = "#c084fc";
    if (theme === "amber") color = "#fbbf24";
    set({ selectedTheme: theme, cursorGlowColor: color });
  },
  resetAll: () => set({
    typingIntensity: 0,
    isPasswordActive: false,
    destabilizeTrigger: false,
    successTrigger: false,
    activeSignupStep: 0,
    selectedTheme: "cyan",
    cursorGlowColor: "#63f3ff",
  })
}));
