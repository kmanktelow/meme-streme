package voice;

import java.util.Arrays;
import java.util.Objects;
import com.nexmo.client.voice.ncco.Action;

public class WebSocketAction implements Action {
    private String action;
    private WebSocketEndpoint[] endpoint;

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public WebSocketEndpoint[] getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(WebSocketEndpoint[] endpoint) {
        this.endpoint = endpoint;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WebSocketAction that = (WebSocketAction) o;
        return Objects.equals(action, that.action) &&
                Arrays.equals(endpoint, that.endpoint);
    }

    @Override
    public int hashCode() {

        int result = Objects.hash(action);
        result = 31 * result + Arrays.hashCode(endpoint);
        return result;
    }


    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("WebSocketAction{");
        sb.append("action='").append(action).append('\'');
        sb.append(", endpoint=").append(Arrays.toString(endpoint));
        sb.append('}');
        return sb.toString();
    }
}
