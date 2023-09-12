# Blogs & Auth Web App

The **Blogs & Auth** web application allows users to create accounts, publish, read, and update their blogs. 
It is built using Express.js, EJS for templating, JSON Web Tokens (JWT) for authentication, and JSON Server as a simple database.

## Features

- **User Registration:** Users can create accounts by providing a username and password. The password is securely hashed before storage.

- **User Authentication:** JWTs are used to authenticate users. Upon successful login, users receive a JWT token, which is used to access protected routes.

- **Blog Creation:** Authenticated users can create and publish their blogs. Blogs consist of a title, content, and an optional image.

- **Blog Editing:** Users can edit their own blogs, updating the title, content, or image.

- **Blog Deletion:** Users can delete their own blogs.

- **View All Blogs:** Users can view all blogs published on the platform.
