import { Project } from "ts-morph";

export function createProject() {
  return new Project({
    useInMemoryFileSystem: false,
  });
}