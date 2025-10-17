export default {
    methods: {
      // Set a cookie with the specified name, value, and expiration in days
      setCookie(name, value, days) {
        let expires = "";
        if (days) {
          const date = new Date();
          // Add the specified number of days to the current date
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          // Log the current and expiration date for debugging
          expires = "; expires=" + date.toUTCString();
        }
        // Set the cookie with path to root
        document.cookie = `${name}=${encodeURIComponent(value || "")}${expires}; path=/`;
      },
  
      // Get a cookie by name
      getCookie(name) {
        const nameEQ = name + "=";
        const cookiesArray = document.cookie.split(';');
        // Iterate through cookies to find the matching one
        for (let i = 0; i < cookiesArray.length; i++) {
          let cookie = cookiesArray[i].trim();
          if (cookie.indexOf(nameEQ) === 0) {
            // Return the cookie value by decoding it
            return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
          }
        }
        return null;
      },
  
      // Delete a cookie by setting its expiration in the past
      deleteCookie(name) {
        console.log("Deleting cookie:", name);
        document.cookie = `${name}=; Max-Age=-99999999; path=/`;
      }
    }
  };
  