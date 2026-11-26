
package com.clubbook.backend.auth;

public class LoginResponse {

    private String token;
    private String email;
    private String role;
    private String clubName;
    private String message;

    public LoginResponse(String token, String email, String role,
                         String clubName, String message) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.clubName = clubName;
        this.message = message;
    }

    public LoginResponse(String email, String role,
                         String clubName, String message) {
        this(null, email, role, clubName, message);
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getClubName() {
        return clubName;
    }

    public String getMessage() {
        return message;
    }
}
