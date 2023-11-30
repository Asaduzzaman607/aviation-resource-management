import { isVoidOrNil } from "./aml";
import { AML_TYPES } from "../../../components/planning/aml/MaintenaceLog/aml.constants";

describe("AML Functionality", () => {
	it("it_determines_is_aml_type_void_or_nil", () => {
		expect(isVoidOrNil(AML_TYPES.REGULAR)).toBe(false);
		expect(isVoidOrNil(AML_TYPES.VOID)).toBe(true);
		expect(isVoidOrNil(AML_TYPES.NIL)).toBe(true);
		expect(isVoidOrNil(AML_TYPES.MAINT)).toBe(false);
	})
})