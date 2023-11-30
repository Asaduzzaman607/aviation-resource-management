import { formatPageNo } from "./AMLFormBasicInfo"

describe("AMLFormBasicInfo", () => {
	it("formatPageNo()", () => {
		expect(formatPageNo({pageNo: 1, alphabet: null})).toBe("1");
		expect(formatPageNo({pageNo: 1, alphabet: "A"})).toBe("1A");
		expect(formatPageNo({pageNo: null, alphabet: "A"})).toBe("N/A");
		expect(formatPageNo({pageNo: null, alphabet: null})).toBe("N/A");
	})
})