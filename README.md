# sunset

This project is a 3D landscape visualization built with Three.js and React. It uses custom shaders for rendering the sky and terrain, providing a dynamic and interactive experience.

## Getting Started

These instructions will help you set up and run the project on your local machine.

### Installation

1. Clone the repository: `git clone https://github.com/johnimril/sunset.git`
2. Navigate to the project directory: `cd sunset`
3. Install the dependencies: `npm install`

### Running the Project

To start the development server, run: `npm start`

The application will be available at `http://localhost:3000`.

### Project Structure

-   `src/components/Landscape.tsx`: Main component for the 3D landscape.
-   `src/components/Sky.tsx`: Component for rendering the sky using a custom shader.
-   `src/shaders/custom-vertex.glsl`: Vertex shader for the terrain.
-   `src/shaders/custom-fragment.glsl`: Fragment shader for the terrain.

### Usage

The project displays a dynamic 3D landscape. The terrain's appearance changes based on mouse movements.

### Deployment

To build the project for production, run: `npm run build`

This will create an optimized build of the application in the `build` directory.

### Contributing

Feel free to contribute to this project by opening issues and submitting pull requests.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Open a pull request.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Acknowledgements

-   The creators of GLSL noise functions (zz85)
-   Special thanks to the community (Dan Tocchini)

### Contact

For any questions or suggestions, please contact [john.maks595@gmail.com].
