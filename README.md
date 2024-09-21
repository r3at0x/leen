# ![icon](public/favicon.ico) SDMVP - LEEN

SDMVP - LEEN is a Next.js application focused on device management, alert systems, and dashboard monitoring. This project provides a robust platform for tracking and managing devices, handling alerts, and visualizing data through an intuitive dashboard interface.

## Key Features

### Device Management

- Comprehensive device tracking and management system
- Real-time status updates for connected devices
- Detailed device information and configuration options

### Alert System

- Real-time alert generation for device-related events
- Customizable alert thresholds and categories
- Instant notifications for critical device issues or status changes

### Dashboard Monitoring

- Centralized dashboard for monitoring all connected devices
- Real-time data visualization and performance metrics
- Interactive charts and graphs for easy data interpretation
- Quick access to device management functions and alert settings

## Technical Stack

- **Frontend**: Next.js with React
- **Authentication**: NextAuth.js (supporting GitHub and Google login)
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Theming**: Dynamic light/dark mode using next-themes

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/sdmvp-leen.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required values (auth secrets, database URI, etc.)

4. Run the development server:

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

- **Authentication**: Configure GitHub and Google OAuth in their respective developer consoles and update `.env.local` with the credentials.
- **Database**: Set up a MongoDB database and update the `MONGODB_URI` in `.env.local`.
- **Device Integration**: Configure device connection settings in the dashboard interface.

## Project Structure

- `components/`: React components including device, alert, and dashboard elements
- `pages/`: Next.js pages and API routes for device management, alerts, and dashboard
- `styles/`: Global styles and theme configurations
- `lib/`: Utility functions for device data processing, alert logic, and dashboard calculations

## License

Copyright © Startup Defense LLC. All Rights Reserved.

## Support

For more information or support, please contact Startup Defense LLC.
