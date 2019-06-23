package voice;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Arrays;
import java.util.Objects;

public class WebSocketEndpoint {
    private String type;
    private String uri;

    @JsonProperty("content-type")
    private String content_type;


    private WebSocketHeader headers;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getContent_type() {
        return content_type;
    }

    public void setContent_type(String content_type) {
        this.content_type = content_type;
    }

    public WebSocketHeader getHeaders() {
        return headers;
    }

    public void setHeaders(WebSocketHeader headers) {
        this.headers = headers;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WebSocketEndpoint endpoint = (WebSocketEndpoint) o;
        return Objects.equals(type, endpoint.type) &&
                Objects.equals(uri, endpoint.uri) &&
                Objects.equals(content_type, endpoint.content_type) &&
                Objects.equals(headers, endpoint.headers);
    }

    @Override
    public int hashCode() {

        return Objects.hash(type, uri, content_type, headers);
    }


    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("WebSocketEndpoint{");
        sb.append("type='").append(type).append('\'');
        sb.append(", uri='").append(uri).append('\'');
        sb.append(", content_type='").append(content_type).append('\'');
        sb.append(", headers=").append(headers);
        sb.append('}');
        return sb.toString();
    }
}
