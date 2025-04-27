import { System } from "./types";

export const groupBySystemType = (
  system: System,
  acc: Record<string, System[]>
) => {
  const key = String(system["system_type" as keyof System]);
  if (!acc[key]) acc[key] = [];
  acc[key].push(system);
  return acc;
};

export const groupByDataUse = (
  system: System,
  acc: Record<string, System[]>,
  dataUseKey: string
) => {
  const array = system.privacy_declarations;
  const foundDataUse = array.find((item) =>
    item.data_use.split(".").includes(dataUseKey)
  );
  // Check if the data use is found in the system's privacy declarations
  if (!foundDataUse) return acc;

  // If found, group by the data use key
  if (!acc[dataUseKey]) acc[dataUseKey] = [];
  acc[dataUseKey].push(system);
  return acc;
};

export const getUniqueCategories = (systemsData: System[]) => {
  return Array.from(
    new Set(
      systemsData.flatMap((system) =>
        system.privacy_declarations.flatMap((declaration) =>
          declaration.data_categories.flatMap((category) => category.split("."))
        )
      )
    )
  );
};
export const getUniqueDataUses = (systemsData: System[]) => {
  return Array.from(
    new Set(
      systemsData.flatMap((system) =>
        system.privacy_declarations.flatMap((declaration) =>
          declaration.data_use.split(".")
        )
      )
    )
  );
};

export const filterSystemsByCategory = (
  systemsData: System[],
  filterCategory: string | null
) => {
  if (!filterCategory) return systemsData;

  return systemsData.filter((system) =>
    system.privacy_declarations.some((declaration) =>
      declaration.data_categories.some((category) =>
        category.includes(filterCategory)
      )
    )
  );
};
