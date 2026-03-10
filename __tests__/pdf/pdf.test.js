import { renderToBuffer } from "@react-pdf/renderer";
import { MatchesPdf } from "@/lib/pdf/matches-pdf";

jest.mock("@react-pdf/renderer", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  return {
    Document: ({ children }) => React.createElement("div", null, children),
    Page: ({ children }) => React.createElement("div", null, children),
    View: ({ children }) => React.createElement("div", null, children),
    Text: ({ children }) => React.createElement("span", null, children),
    StyleSheet: { create: (s) => s },
    renderToBuffer: async (element) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ReactDOMServer = require("react-dom/server");
      return Buffer.from(ReactDOMServer.renderToStaticMarkup(element));
    },
  };
});

const mockMatch = {
  id: 1,
  matchday: 1, // month matchday
  categoryName: "1ª",
  players: [
    {
      id: 1,
      full_name: "Juan Comendeiro",
      nickname: "Comendeiro",
    },
    {
      id: 2,
      full_name: "Javier García",
      nickname: "Javi",
    },
    {
      id: 3,
      full_name: "Isaac López",
      nickname: "Isaac",
    },
    {
      id: 4,
      full_name: "Iván Martínez",
      nickname: "Iván",
    },
  ],
};

const matchesByDay = {
  1: { // global matchday
    "1ª": [mockMatch],
  },
};

const renderToText = async (matchesByDay) => {
  const buffer = await renderToBuffer(
    <MatchesPdf matchesByDay={matchesByDay} />,
  );
  return buffer.toString();
};

describe("MatchesPdf", () => {
  it("renders without errors", async () => {
    await expect(renderToText(matchesByDay)).resolves.not.toThrow();
  });

  it("shows nicknames", async () => {
    const output = await renderToText(matchesByDay);

    expect(output).toContain("Comendeiro");
    expect(output).toContain("Javi");
    expect(output).toContain("Isaac");
    expect(output).toContain("Iván");
  });

  it("uses full_name when no nickname", async () => {
    const matchSinNickname = {
      ...mockMatch,
      players: [
        { nickname: null, full_name: "Juan Comendeiro" },
        { nickname: null, full_name: "Javier García" },
        { nickname: null, full_name: "Isaac López" },
        { nickname: null, full_name: "Iván Martínez" },
      ],
    };

    const output = await renderToText({ 1: { "1ª": [matchSinNickname] } });

    expect(output).toContain("Juan Comendeiro");
    expect(output).toContain("Javier García");
    expect(output).toContain("Isaac López");
    expect(output).toContain("Iván Martínez");
  });

  it("doesnt render incomplete matches", async () => {
    const matchIncompleto = {
      ...mockMatch,
      players: [
        { nickname: "Solo", full_name: "Solo Jugador" },
        { nickname: "Dos", full_name: "Dos Jugador" },
      ],
    };

    const output = await renderToText({ 1: { "1ª": [matchIncompleto] } });

    expect(output).not.toContain("Solo");
    expect(output).not.toContain("Dos");
  });

  it("shows matchday title", async () => {
    const output = await renderToText(matchesByDay);
    expect(output).toContain("Jornada 1");
  });

  it("shows category name", async () => {
    const output = await renderToText(matchesByDay);
    expect(output).toContain("1ª");
  });

  it("renders each player 3 times per match", async () => {
    const output = await renderToText(matchesByDay);

    expect(output.split("Comendeiro").length - 1).toBe(3);
    expect(output.split("Javi").length - 1).toBe(3);
    expect(output.split("Isaac").length - 1).toBe(3);
    expect(output.split("Iván").length - 1).toBe(3);
  });
});
