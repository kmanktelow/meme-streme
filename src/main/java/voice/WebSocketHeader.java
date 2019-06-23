package voice;

import java.util.Objects;

public class WebSocketHeader {
    private String name;
    private String callback;

    public WebSocketHeader(String name, String callback) {
        this.name = name;
        this.callback = callback;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCallback() {
        return callback;
    }

    public void setCallback(String callback) {
        this.callback = callback;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WebSocketHeader that = (WebSocketHeader) o;
        return Objects.equals(name, that.name) &&
                Objects.equals(callback, that.callback);
    }

    @Override
    public int hashCode() {

        return Objects.hash(name, callback);
    }


    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("WebSocketHeader{");
        sb.append("name='").append(name).append('\'');
        sb.append(", callback='").append(callback).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
