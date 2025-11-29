import { ref, watch } from "vue";

const isDark = ref(false);

//watch observer
watch(isDark, (value) => {
  const root = document.documentElement;

  if (value) {
    document.documentElement.classList.add("my-app-dark");

    root.style.setProperty(
      "--bg-login",
      "linear-gradient(to bottom right, #0a2540 0%, #0a2540 40%, #213D5EFF 50%, #173557FF 60%, #0a2540 100%)"
    );

    root.style.setProperty("--login-form-bg", "rgba(20, 32, 54, 0.55)");
    root.style.setProperty("--login-form-border", "rgba(255, 255, 255, 0.10)");
    root.style.setProperty(
      "--login-form-shadow",
      "0 8px 28px rgba(0, 0, 0, 0.40)"
    );
    root.style.setProperty("--login-title-text", "rgba(200, 220, 240, 0.9)");
  } else {
    document.documentElement.classList.remove("my-app-dark");

    root.style.setProperty(
      "--bg-login",
      "linear-gradient(to bottom right, #87ceeb, #ffffff)"
    );

    root.style.setProperty("--login-form-bg", "rgba(255, 255, 255, 0.55)");
    root.style.setProperty("--login-form-border", "rgba(255, 255, 255, 0.25)");
    root.style.setProperty(
      "--login-form-shadow",
      "0 8px 28px rgba(0, 0, 0, 0.15)"
    );
    root.style.setProperty("--login-title-text", "rgb(46, 97, 121)");
  }
});

export function toogleTheme() {
  //switch theme
  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  return { isDark, toggleTheme };
}
