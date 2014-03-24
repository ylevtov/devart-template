Right, time to get the DMX lighting side of stuff underway. I was planning on sending DMX signals straight out of Max for Live via Olaf Matthes' dmxusbpro external, however I quickly ran into debilitating performance issues when trying to send messages to multiple lamps simultaneously. To be perfectly honest, I'm not sure what's to blame here - it could be the external, my lack of knowledge of the external, or performance issues when running from M4L. It was probably due to a combination of those factors, but the only thing I knew for certain was that I didn't have time to get to the bottom of it, so I decided to transition to Pure Data, where I am much more comfortable and have done this kind of thing before.  

From Ableton, I needed to know various pieces of information about the music, such as:
- whether or not various instruments are playing
- MIDI notes for various instruments
- what section of the track we are in
- output values of certain effect parameters

I created a M4L patch to grab all of these values and send them to Pd over OSC. 

![M4L data sender patch](project_images/m4l-to-pd-sends.png?raw=true "M4L sending info about the track to Pure data via OSC")

Once in Pure Data, I went about assigning the received parameters to various lighting sequences. I spent some time working out a flexible way of addressing various combination of lights, as we're planning on having 8 groups of lights that can each be addressed individually, and came up with a nice bus system in Pd which allows me to quickly group any combination of lights in any way I choose. 

![Pd DMX lamp bussing system](project_images/pd-dmx-bus.png?raw=true "Pd DMX lamp bussing system")

Here's a little video of some of the lighting sequences. I only had access to two of the eight lamps when I started prototyping this so I made a little visualizer in Pd to simulate the rig. The real lamps you can see are only lamps one and two of eight, so it's a bit hard to see what's going on, but you get the idea...  

http://www.youtube.com/watch?v=NK9E5z6s99s&feature=youtu.be