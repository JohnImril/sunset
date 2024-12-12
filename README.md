# Sunset

**Sunset** is a 3D landscape visualization that leverages **Three.js** and **React** to create an immersive, dynamic environment. By combining custom shaders and interactive controls, this project simulates a stylized terrain and sky that respond in real-time to user input.

## Features

- **Real-Time Rendering:** Experience fluid, interactive 3D graphics powered by Three.js.
- **Custom Shaders:** A custom vertex and fragment shader pipeline for the terrain and sky ensures visually rich and unique aesthetics.
- **Dynamic Interaction:** The landscape’s appearance shifts with mouse movement, offering a more engaging and exploratory experience.
- **Modern Stack:** Built with React for a modular and maintainable codebase, simplifying updates and improvements.

## Getting Started

Follow these steps to run the project locally:

### Prerequisites

- **Node.js** (v14 or later recommended)
- **npm**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/johnimril/sunset.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd sunset
   ```

3. **Install the dependencies:**

   ```bash
   npm install
   ```

### Running the Project

Start the development server with:

```bash
npm run dev
```

The application will be served at [http://localhost:5173](http://localhost:5173).

### Project Structure

- **`src/components/Landscape.tsx`**: The main component that sets up and renders the 3D terrain.
- **`src/components/Sky.tsx`**: A dedicated component for rendering the sky with a custom shader.
- **`src/shaders/custom-vertex.glsl`**: Vertex shader logic for shaping and deforming the terrain.
- **`src/shaders/custom-fragment.glsl`**: Fragment shader logic for coloring and shading the terrain’s surface.

## Usage

By moving your mouse over the rendered scene, you can subtly alter the terrain’s appearance, simulating a shifting landscape as the sky and environment adapt in real time.

## Deployment

To build the project for production:

```bash
npm run build
```

An optimized version of the application will be generated in the `build/` directory, ready for deployment on any static file hosting service.

## Contributing

Contributions are welcome! To propose changes, improvements, or new features:

1. **Fork the repository**.
2. **Create a feature branch**:  

   ```bash
   git checkout -b feature/my-feature
   ```

3. **Commit your changes**:  

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to your branch**:  

   ```bash
   git push origin feature/my-feature
   ```

5. **Open a pull request** and describe your changes.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- Special thanks to **zz85** for their GLSL noise functions.
- Gratitude goes to **Dan Tocchini** and the broader Three.js community for insights and inspiration.

## Contact

For questions, feedback, or suggestions, feel free to reach out at [john.maks595@gmail.com](mailto:john.maks595@gmail.com).
