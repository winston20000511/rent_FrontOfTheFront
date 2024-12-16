<template>
    <div id="complation-form">
      <h1>Complation Form</h1>
  
      <form @submit.prevent="handleSubmit">
        <!-- Username Input -->
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="form.username" required />
        </div>
  
        <!-- User ID Input -->
        <div class="form-group">
          <label for="user_id">User ID:</label>
          <input type="text" id="user_id" v-model="form.userId" required />
        </div>
  
        <!-- Category Dropdown -->
        <div class="form-group">
          <label for="category">Category:</label>
          <select id="category" v-model="form.category" required>
            <option disabled value="">Select a category</option>
            <option value="General">General</option>
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
          </select>
        </div>
  
        <!-- Subject Input -->
        <div class="form-group">
          <label for="subject">Subject:</label>
          <input type="text" id="subject" v-model="form.subject" required />
        </div>
  
        <!-- Content Textarea -->
        <div class="form-group">
          <label for="content">Content:</label>
          <textarea id="content" v-model="form.content" rows="5" required></textarea>
        </div>
  
        <!-- Submission Button -->
        <div class="form-group">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          username: "",
          userId: "",
          category: "",
          subject: "",
          content: "",
        },
      };
    },
    methods: {
      handleSubmit() {
        console.log("Form data submitted:", this.form);
  
        // Replace with your API request logic
        // Example:
        // axios.post('/api/complaints', this.form)
        //   .then(response => {
        //     console.log("Success:", response.data);
        //   })
        //   .catch(error => {
        //     console.error("Error:", error);
        //   });
  
        // Clear the form after submission
        this.resetForm();
      },
      resetForm() {
        this.form = {
          username: "",
          userId: "",
          category: "",
          subject: "",
          content: "",
        };
      },
    },
  };
  </script>
  
  <style scoped>
  #complation-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input,
  select,
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>