import React from "react";
import { render } from "@testing-library/react";
import Appointment from "components/Appointment";
import { iteratee } from "lodash";

describe("Appointment", () => {
    it("renders without crashing", () => {
      render(<Appointment />);
    });
  });
  
