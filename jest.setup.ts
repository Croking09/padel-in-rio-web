import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
// @ts-expect-error - The types for TextDecoder in the 'util' module might differ slightly from the global DOM TextDecoder
global.TextDecoder = TextDecoder;
