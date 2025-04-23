package com.auth.jwt.data.dto.authorization;

import java.util.Arrays;
import java.util.Objects;

public class CredentialsDto {

    private String userName;
    private char[] password;

    public CredentialsDto() {
        // Pusty konstruktor dla deserializacji JSON
    }

    public CredentialsDto(String userName, char[] password) {
        this.userName = userName;
        this.password = password;
    }

    // Zachowujemy metodę getLogin dla kompatybilności z frontendem
    public String getLogin() {
        return userName;
    }

    // Zachowujemy metodę setLogin dla kompatybilności z frontendem
    public void setLogin(String login) {
        this.userName = login;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public char[] getPassword() {
        return password;
    }

    public void setPassword(char[] password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "CredentialsDto{" +
                "userName='" + userName + '\'' +
                ", password=" + Arrays.toString(password) +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CredentialsDto that = (CredentialsDto) o;
        return Arrays.equals(password, that.password) && Objects.equals(userName, that.userName);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(userName);
        result = 31 * result + Arrays.hashCode(password);
        return result;
    }
}
