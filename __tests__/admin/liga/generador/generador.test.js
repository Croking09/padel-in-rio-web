import { generateCategoryMatches } from "@/lib/utils";

describe("generateCategoryMatches", () => {
  const mockPlayers = [
    { id: "1", name: "Player 1" },
    { id: "2", name: "Player 2" },
    { id: "3", name: "Player 3" },
    { id: "4", name: "Player 4" },
    { id: "5", name: "Player 5" },
    { id: "6", name: "Player 6" },
    { id: "7", name: "Player 7" },
    { id: "8", name: "Player 8" },
  ];

  beforeEach(() => {
    jest.spyOn(Math, "random").mockRestore();
  });

  it("should generate 4 matches", () => {
    const matches = generateCategoryMatches(
      "cat-1",
      "Categoría A",
      mockPlayers,
    );
    expect(matches).toHaveLength(4);
  });

  it("should generate 2 matches for matchday 1 and 2 for matchday 2", () => {
    const matches = generateCategoryMatches(
      "cat-1",
      "Categoría A",
      mockPlayers,
    );

    const matchday1 = matches.filter((m) => m.matchday === 1);
    const matchday2 = matches.filter((m) => m.matchday === 2);

    expect(matchday1).toHaveLength(2);
    expect(matchday2).toHaveLength(2);
  });

  it("should assign 4 players to each match", () => {
    const matches = generateCategoryMatches(
      "cat-1",
      "Categoría A",
      mockPlayers,
    );

    matches.forEach((match) => {
      expect(match.players).toHaveLength(4);
    });
  });

  it("should assign categoryId and categoryName correctly", () => {
    const matches = generateCategoryMatches(
      "cat-1",
      "Categoría A",
      mockPlayers,
    );

    matches.forEach((match) => {
      expect(match.categoryId).toBe("cat-1");
      expect(match.categoryName).toBe("Categoría A");
    });
  });

  it("should assign players in a predictable order", () => {
    // Sin cambios en el orden
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    const matches = generateCategoryMatches(
      "cat-1",
      "Categoría A",
      mockPlayers,
    );

    // Jornada 1
    expect(matches[0].matchday).toBe(1);
    expect(matches[0].players.map((p) => p.id)).toEqual(["1", "2", "3", "4"]);

    expect(matches[1].matchday).toBe(1);
    expect(matches[1].players.map((p) => p.id)).toEqual(["5", "6", "7", "8"]);

    // Jornada 2
    expect(matches[2].matchday).toBe(2);
    expect(matches[2].players.map((p) => p.id)).toEqual(["1", "2", "5", "6"]);

    expect(matches[3].matchday).toBe(2);
    expect(matches[3].players.map((p) => p.id)).toEqual(["3", "4", "7", "8"]);
  });

  it("should use each player exactly 2 times", () => {
    const matches = generateCategoryMatches(
      "cat-1",
      "Categoría A",
      mockPlayers,
    );

    const playerCounts = new Map();

    matches.forEach((match) => {
      match.players.forEach((player) => {
        playerCounts.set(player.id, (playerCounts.get(player.id) || 0) + 1);
      });
    });

    mockPlayers.forEach((player) => {
      expect(playerCounts.get(player.id)).toBe(2);
    });
  });

  it("shouldnt mutate the original players array", () => {
    const originalPlayers = [...mockPlayers];

    generateCategoryMatches("cat-1", "Categoría A", mockPlayers);

    expect(mockPlayers).toEqual(originalPlayers);
  });
});
