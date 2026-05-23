import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostCard from "./PostCard";

describe("PostCard", () => {
  test("renderiza título del post", () => {
    const post = {
      id: 1,
      title: "Laptop Gamer",
      venta: true,
      price: 5000,
      images: [],
      user: {
        name: "Michael",
      },
    };

    render(
      <MemoryRouter>
        <PostCard post={post} />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Laptop Gamer")
    ).toBeInTheDocument();
  });
});