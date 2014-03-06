### Proof of concept - Node.js + Socket.io + WebGL + Ableton
Yesterday, Owen and I got working an almost completely end-to-end, bare-bones implementation of the tech-stack, and here's a quick video of the result:  
http://www.youtube.com/watch?v=girFDD8dWW8  

Here we've got a Node server to which the three devices have connected. Each device sees a grid of buttons, but has only it's own button activated. All devices can see other devices' button presses. The Node server is sending the button-pressed and button-released messages to an Ableton Live set via MIDI. The Ableton Live set generates the audio, but is also sending BPM information to a visualiser page via OSC (using a custom Max For Live patch), which is transforming a cube in a WebGL canvas in time with the music.  

You might also see the buttons on the devices disappearing when they are tapped, and then fading back in slowly. This is the timeout functionality we've been wanting to integrate, meaning that a certain amount of time has to pass before a visitor can retrigger an action. The buttons can only be tapped when they are at full opacity.  

In terms of core-functionality that is yet to be built, the next steps will be:
- generate WebGL visuals on client devices (currently only HTML)
- send data to lighting fixtures from Ableton Live via DMX
- implement Wi-Fi captive portal, so WebGL visuals are displayed immediately upon visitor joining the Wi-Fi network (i.e. without even needing to go to their browser manually)  

Very happy with progress so far. Looking forward to the next session!