/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 */
package cz.cvut.fel.webrtc.resources;

import com.google.gson.JsonObject;
import org.kurento.client.Hub;
import org.kurento.client.HubPort;
import org.kurento.client.MediaPipeline;
import org.kurento.client.PassThrough;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.Closeable;
import java.io.IOException;

/**
 * 
 * @author Ivan Gracia (izanmail@gmail.com)
 * @since 4.3.1
 */
public abstract class Participant implements Closeable {

	private static final Logger log = LoggerFactory.getLogger(Participant.class);

	private final String id;
	protected String name;
	protected final WebSocketSession session;
	protected final String roomName;
	private final Hub hub;
	protected HubPort hubPort;

	// Record
	private PassThrough passThru;

	/**
	 * constructor of the class participant
	 * 
	 * @param id
	 *            identifier of the participant
	 * @param roomName
	 *            The room to which the user is currently attending
	 * @param session
	 *            the link between internet and the participant
	 * @param compositePipeline
	 *            container of MediaElements, canal from kurento to user
	 * @param presentationPipeline
	 *            container of MediaElements, canal from user to kurento
	 * @param hub
	 *            this is where all the participant of the room connect themself
	 */
	public Participant(final String id, String roomName, final WebSocketSession session,
			MediaPipeline compositePipeline, MediaPipeline presentationPipeline, Hub hub) {

		this.id = id;
		this.session = session;
		this.roomName = roomName;
		this.passThru = new PassThrough.Builder(compositePipeline).build();
		this.hub = hub;
		this.hubPort = new HubPort.Builder(hub).build();
	}

	/**
	 * @return the name the participant
	 */
	public String getName() {
		return name;
	}

	/**
	 * change the name of the participant
	 * 
	 * @param name
	 *            new name of the participant
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the session
	 */
	public WebSocketSession getSession() {
		return session;
	}

	/**
	 * The room to which the user is currently attending
	 * 
	 * @return The room
	 */
	public String getRoomName() {
		return this.roomName;
	}

	/**
	 * send the message to the participants of the room
	 * 
	 * @return The room
	 */
	public void sendMessage(JsonObject message) throws IOException {
		log.debug("USER {}: Sending message {}", name, message);
		synchronized (session) {
			session.sendMessage(new TextMessage(message.toString()));
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {

		if (this == obj) {
			return true;
		}
		if (obj == null || !(obj instanceof Participant)) {
			return false;
		}
		Participant other = (Participant) obj;
		boolean eq = id.equals(other.id);
		eq &= roomName.equals(other.roomName);
		return eq;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		int result = 1;
		result = 31 * result + id.hashCode();
		result = 31 * result + roomName.hashCode();
		return result;
	}

	@Override
	public abstract void close() throws IOException;

	/**
	 * creation of a link between the participant and the hub
	 * 
	 * 
	 */
	private void newHubPort() {
		if (hubPort == null)
			this.hubPort = new HubPort.Builder(hub).build();
	}

	/**
	 * destruction of the link between the participant and the hub
	 * 
	 * 
	 */
	protected void releaseHubPort() {
		hubPort.release();
		hubPort = null;
	}

	/**
	 * creation of a link between the participant and the current preferred hub
	 * 
	 * 
	 */
	protected void renewHubPort() {
		releaseHubPort();
		newHubPort();
	}

	/**
	 * 
	 * @return the id of the participant
	 */
	public String getId() {
		return id;
	}

	public HubPort getHubPort() {
		return hubPort;
	}

	public void setHubPort(HubPort hubPort) {
		this.hubPort = hubPort;
	}

	public PassThrough getPassThru() {
		return passThru;
	}

	public void setPassThru(PassThrough passThru) {
		this.passThru = passThru;
	}

	public Hub getHub() {
		return hub;
	}
}
