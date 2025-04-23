package com.auth.jwt.data.dto.authorization;

import java.util.Arrays;
import java.util.Objects;

public class CredentialsDto {

    private String login;
    private char[] password;

    public CredentialsDto(String login, char[] password) {
        this.login = login;
        this.password = password;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
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
                "login='" + login + '\'' +
                ", password=" + Arrays.toString(password) +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CredentialsDto that = (CredentialsDto) o;
        return Arrays.equals(password, that.password) && Objects.equals(login, that.login);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(login);
        result = 31 * result + Arrays.hashCode(password);
        return result;
    }
}
