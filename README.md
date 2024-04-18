TASK_MANAGEMENT

### How to run project

**Running the Project (3 Simple Steps)**

This project is designed to be easy to set up and run. Follow these three commands to get started:

**1. Install Dependencies:**

* Open your terminal or command prompt.
* Navigate to the directory where you cloned the project using `cd your-repo-name` (replace `your-repo-name` with the actual name).
* Run the following command to install all the necessary libraries and packages listed in the project's `package.json` file:
  Bash

  ```
  npm install
  ```

  Use code [with caution.](https://gemini.google.com/faq#coding)

  content_copy

**2. Start the Development Server (Recommended):**

* To start the development server, which allows hot reloading and automatic updates whenever you make changes to the code, run:
  Bash

  ```
  npm start
  ```

  Use code [with caution.](https://gemini.google.com/faq#coding)

  content_copy
* Alternatively, if the project uses a different development script name, refer to the project's specific instructions or look for a script named `dev` or `start:dev` in the `package.json` file.
* Once the server starts, it typically listens on a port (often `3000` by default). You can access the application in your web browser by visiting `http://localhost:<port>`, replacing `<port>` with the actual port number.

### Auth

#### Functions Description

This file contains functions related to user authentication and authorization.

#### Functions:

1. **register**
   * Endpoint for user signup.
   * Accepts user data (email, password, name) in the request body.
   * Checks email validity, ensures email uniqueness, hashes the password, creates a new user, and generates a JWT token upon successful signup.
2. **login**
   * Endpoint for user login.
   * Accepts user credentials (email, password) in the request body.
   * Validates email format, finds the user by email, checks for account lock status, compares passwords, and generates a JWT token upon successful login.

---

### Task

#### Functions Description

This file contains functions for managing tasks in the application.

#### Functions:

1. **createTaskByUser**
   * Creates a new task.
   * Accepts task data in the request body.
   * Handles validation errors and returns the created task upon success.
2. **getSingleTask**
   * Retrieves a single task by its ID.
   * Accepts task ID in the request parameters.
   * Optionally filters tasks based on user role (admin or regular user).
3. **getListTasks**
   * Retrieves a list of tasks.
   * Supports pagination, sorting, and filtering based on user ID and task status.
4. **updateTaskByUser**
   * Updates a task by a regular user.
   * Accepts task ID in the request parameters and updated task data in the request body.
   * Ensures the user field cannot be updated by users.
5. **updateTaskByAdmin**
   * Updates a task by an admin user.
   * Accepts task ID in the request parameters and updated task data in the request body.
6. **deleteTask**
   * Deletes a task by its ID.
   * Accepts task ID in the request parameters.
