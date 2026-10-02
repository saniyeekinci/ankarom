export const catalogActionStyle = {
  backgroundColor: "#fff",
  borderColor: "#1e344f",
  color: "#1e344f",
  borderRadius: 0,
  transition: "none",
};

export function setCatalogActionAppearance(
  element: HTMLElement,
  isActive: boolean,
) {
  element.style.setProperty(
    "background-color",
    isActive ? "#1e344f" : "#fff",
    "important",
  );
  element.style.setProperty("border-color", "#1e344f", "important");
  element.style.setProperty("border-radius", "0", "important");
  element.style.setProperty(
    "color",
    isActive ? "#fff" : "#1e344f",
    "important",
  );
}
