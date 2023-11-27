import React from "react";
import { render, fireEvent, waitForElement, prettyDOM, waitFor } from '@testing-library/react';
import Application from "components/Application";

it("defaults to Monday and changes the schedule when a new day is selected", async () => {
  const { getByText } = render(<Application />);

  await waitForElement(() => getByText("Monday"));

  fireEvent.click(getByText("Tuesday"));

  expect(getByText("Leopold Silvers")).toBeInTheDocument();
});

describe("Application", () => {
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug, getByText, getByPlaceholderText, getAllByTestId, queryByText, waitForElementToBeRemoved, waitFor } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
  
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container, debug, getByText, getAllByTestId, queryByText, getByAltText, getByPlaceholderText, waitForElementToBeRemoved, waitFor } = render(<Application />);

    await waitForElement(() => getByText("Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Edit"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    // Find the specific day node that contains the text "Monday"
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    // Check that the day with the text "Monday" still has the text "no spots remaining"
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

    debug();
  });

  it("shows the save error when failing to save an appointment", async () => {
    const { container, getByText, getByPlaceholderText, getAllByTestId, waitForElementToBeRemoved, waitFor } = render(<Application />);

    await waitForElement(() => getByText("Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    axios.put.mockRejectedValueOnce(new Error("Error saving appointment"));

    await waitFor(() => expect(getByText(appointment, "Error")).toBeInTheDocument());

    fireEvent.click(getByText(appointment, "Close"));

    expect(getByText(appointment, "Error")).not.toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    const { container, getByText, getAllByTestId, getByAltText } = render(<Application />);

    await waitForElement(() => getByText("Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));

    axios.delete.mockRejectedValueOnce(new Error("Error deleting appointment"));

    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitFor(() => expect(getByText(appointment, "Error")).toBeInTheDocument());

    fireEvent.click(getByText(appointment, "Close"));

    expect(getByText(appointment, "Error")).not.toBeInTheDocument();
  });
});
