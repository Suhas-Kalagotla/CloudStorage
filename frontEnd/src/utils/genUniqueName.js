export const generateUniqueName = (
  baseName,
  files = [],
  folders = [],
  currentId = null,
) => {
  const existingNames = [
    ...files.filter((item) => item.id !== currentId).map((item) => item.name),
    ...folders.filter((item) => item.id !== currentId).map((item) => item.name),
  ];

  let name = baseName;
  let count = 1;

  while (existingNames.includes(name)) {
    name = `${baseName} ${count}`;
    count++;
  }

  return name;
};
