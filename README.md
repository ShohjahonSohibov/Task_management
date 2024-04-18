TASK_MANAGEMENT


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
