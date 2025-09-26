
# Human-Machine GUI (hmgui)

This project is a web-based dashboard for visually monitoring the status of robot data collection. Built with React and Vite, it displays real-time information such as the robot's joint angles, end-effector positions, camera images, and dataset configurations via a WebSocket connection.

---

## Getting Started

There are a few prerequisites to run this project in your local environment.

### Prerequisites

You need **Node.js** and **npm** to run this project. Please download and install the LTS version from the link below. npm is installed automatically when you install Node.js.

-   [Download Node.js](https://nodejs.org/)

Once the installation is complete, open your terminal (CMD or PowerShell for Windows, Terminal for macOS) and enter the following commands to verify that they were installed correctly.

```bash
node -v 
npm -v
````
v20.19.0
10.8.2

If the version numbers are displayed for each, the installation was successful.

## Installation and Execution

### 1\. Clone the Project

First, clone this repository to your local machine.

```bash
git clone <YOUR_REPOSITORY_URL>
cd hmgui
```

### 2\. Install Dependencies

Install the necessary libraries for the project.

```bash
npm install
```

### 3\. Run the Dummy WebSocket Server

This project uses a WebSocket to receive robot status and camera images. Open a new terminal window, navigate to the project's root directory, and run the following command to start the dummy server.

```bash
node dummy-ws-server.js
```

If the server starts successfully, you will see the message `Dummy WS Server running at ws://localhost:9090`. You need to keep this terminal window open while the GUI is running.

### 4\. Run the Development Server

Now, start the development server to run the React application. Open another new terminal window and run the following command.

```bash
npm run dev
```

You can now access the monitoring GUI by navigating to `http://localhost:5173` (or the address shown in your terminal) in your web browser.

```
```
