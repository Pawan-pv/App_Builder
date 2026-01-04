import { describe, it, expect } from "vitest";
import type { Widget } from "../../types";
import { removeFromTree, insertIntoTree } from "../UniversalBuilderContext";

describe("Tree Helpers", () => {
  const makeWidget = (id: string, children?: Widget[]): Widget => ({
    id,
    type: "Text",
    label: id,
    props: {},
    children,
  });

  describe("removeFromTree", () => {
    it("removes a root widget", () => {
      const tree = [makeWidget("a"), makeWidget("b")];

      const { updated, removed } = removeFromTree(tree, "a");

      expect(removed?.id).toBe("a");
      expect(updated.map(w => w.id)).toEqual(["b"]);
    });

    it("removes a deeply nested widget", () => {
      const tree = [
        makeWidget("a", [
          makeWidget("b", [
            makeWidget("c")
          ])
        ])
      ];

      const { updated, removed } = removeFromTree(tree, "c");

      expect(removed?.id).toBe("c");
      expect(updated[0].children?.[0].children).toHaveLength(0);
    });

    it("returns same tree if widget not found", () => {
      const tree = [makeWidget("a")];

      const { updated, removed } = removeFromTree(tree, "x");

      expect(removed).toBeUndefined();
      expect(updated).toEqual(tree);
    });
  });

  describe("insertIntoTree", () => {
    it("inserts widget at root index", () => {
      const tree = [makeWidget("a")];
      const newWidget = makeWidget("b");

      const updated = insertIntoTree(tree, null, newWidget, 0);

      expect(updated.map(w => w.id)).toEqual(["b", "a"]);
    });

    it("inserts widget into parent children", () => {
      const tree = [makeWidget("a", [])];
      const child = makeWidget("b");

      const updated = insertIntoTree(tree, "a", child, 0);

      expect(updated[0].children?.[0].id).toBe("b");
    });

    it("does not mutate original tree", () => {
      const tree = [makeWidget("a")];
      const copy = structuredClone(tree);

      insertIntoTree(tree, null, makeWidget("b"), 0);

      expect(tree).toEqual(copy);
    });
  });
});
