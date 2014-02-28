### The scene 
The room will feature a surround sound speaker system, an array of lighting Par Cans, and, time-permitting, projected visuals.  

The music playing over the speakers will be a bespoke dynamic music composition written by us, and will be constantly evolving and reacting to the visitors in the room. The lighting and projected visuals will be perfectly synchronised to what's happening in the music.  

### Musical interaction
On arrival, visitors are invited to join the installation’s own public Wi-Fi network. Upon joining the network, visitors are automatically taken to a simple web-page displaying information about the currently playing music and a few buttons which they can use to interact with the piece. The impact a button may have can vary from something small like triggering a short sample, through to more dramatic effects like changes in tempo or musical section.

Visitors’ interactions with the music are rate-limited (i.e. after effecting the music, a certain period of time must pass before that visitor is allowed to interact again) so as to ensure everyone’s individual interactions can be identified. The severity of the visitor’s interaction increases over time spent in the installation i.e. visitors who have only just arrived can only trigger a short sample every minute or so, whereas someone who has been in the installation for 20+ minutes can change the whole tempo of the track. Again, the visual elements in the room will perfectly complement the music, so when a visitor affects the sound, they are also affecting their visual surroundings.  

### Social interaction
At times, visitors' interfaces will change to request that visitors communicate with each other in some way. Some examples could be:
- Allocate a small group (4-5) of users a particular colour, and prompting them: "Find the other visitors with a blue screen then tap this button all all the same time"
- Issuing a question via poll: "Should the music become more intense or more relaxed?"
- Issuing a command: "Shake!"

### Tech stack
The main element of the installation is a Node server running Socket.io, which transmits MIDI data to an Ableton Live session. The clients (i.e. the visitors' devices) will communicate with the server via WebSockets and display visuals in the mobile Chrome browser.

![Tech topology diagram](project_images/tech-stack-topology.jpg?raw=true "Tech topology diagram")