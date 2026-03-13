import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePage from "../pages/HomePage";
import axios from "axios";

jest.mock("axios");
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("HomePage Component", () => {

  const mockContacts = {
    data: {
      contacts: [
        {
          _id: "1",
          name: "John Doe",
          email: "john@test.com",
          phone: "1234567890",
          company: "ABC Corp",
          status: "Lead",
          notes: "Important client"
        }
      ],
      pages: 1,
      page: 1
    }
  };

  beforeEach(() => {
    axios.get.mockResolvedValue(mockContacts);

    Storage.prototype.getItem = jest.fn(() => "mockToken");
  });

  // 1️⃣ Heading render
  test("renders Contacts heading", async () => {
    render(<HomePage />);

    expect(await screen.findByText("Contacts")).toBeInTheDocument();
  });

  // 2️⃣ Add Contact button
  test("renders Add Contact button", async () => {
    render(<HomePage />);

    expect(await screen.findByText("+ Add Contact")).toBeInTheDocument();
  });

  // 3️⃣ Search input
  test("renders search input", async () => {
    render(<HomePage />);

    expect(
      await screen.findByPlaceholderText("Search by name or email...")
    ).toBeInTheDocument();
  });

  // 4️⃣ Contact data appears
  test("displays contact data in table", async () => {
    render(<HomePage />);

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@test.com")).toBeInTheDocument();
  });

  // 5️⃣ Modal opens when Add Contact clicked
  test("opens Add Contact modal", async () => {
    render(<HomePage />);

    fireEvent.click(await screen.findByText("+ Add Contact"));

    expect(screen.getByText("Add Contact")).toBeInTheDocument();
  });

  // 6️⃣ Form validation for name
  test("shows name validation error", async () => {
    render(<HomePage />);

    fireEvent.click(await screen.findByText("+ Add Contact"));

    fireEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
  });

  // 7️⃣ Email validation
  test("shows email validation error", async () => {
    render(<HomePage />);

    fireEvent.click(await screen.findByText("+ Add Contact"));

    const nameInput = screen.getByPlaceholderText("Name");

    fireEvent.change(nameInput, { target: { value: "John" } });

    fireEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
  });

  // 8️⃣ Search filter
  test("filters contacts by name", async () => {
    render(<HomePage />);

    const searchInput = await screen.findByPlaceholderText(
      "Search by name or email..."
    );

    fireEvent.change(searchInput, { target: { value: "John" } });

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
  });

  // 9️⃣ Logout button exists
  test("renders logout button", async () => {
    render(<HomePage />);

    expect(await screen.findByText("Log Out")).toBeInTheDocument();
  });

});
