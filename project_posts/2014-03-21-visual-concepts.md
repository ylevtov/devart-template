# Visual Concepts & Audience Interaction 

In coming up with the user interface for the phones & other devices that people would use to interact with the installation, I really wanted to try and get across - as best I could  - the fact that this is meant to be a collaborative experience in creating and experiencing music, rather than too much of a 'control system' to be mastered and understood.

I started thinking about traditional control interfaces that are permanently on-screen, perhaps with some controls disabled and becoming alive for a short while, excatly as we'd had during development. To me this often has the effect of making people click on controls as soon as they become available, with little consideration for the timing and effect it'll have on the overall system.

If we could find a way of implicitly encouraging people, once they'd been granted access to a control, to save it until the right time musically before using it, hopefully the overall musical experience in the space with large numbers of people will be better!

## Card games

At this point I hit on the idea of cards - specifically the 'chance' cards that you draw in board games that grant you a special ability, but to get the greatest benefit you might sit on it for a period of time before unleashing it to devastating effect (or at least I try to during a particularly combatative game of QI). Also of interest is the hoarding behaviour of sitting on a number of cards, which in combination could have an even more interesting effect on the game's outcome.

## Mockups

So I tried to express this idea with a couple of mockups:

![Cards Mockup](project_images/Dynamics-cards-mockup-small.jpg?raw=true "Cards Mockup")

Importantly at the start is the 'Listen and Wait' instruction, first and foremost we want people to focus on the music. 

Then the first 'card' will appear (here shown as part of a collection), with a simple description as to what it will do (add a kick drum). We don't want people to hit this button right away, rather they should read it, listen to the current state of the track and wait until the right moment before 'playing' their hand.

Implicit in this layout also is the ability to flick through the cards in your 'hand', so you're not limited to the one that's immediately in front of you.

Next up, we have a number of different controls, from a low-pass filter (with a time allowance which starts counting down as soon as you start using it), and a toggle switch.

### Multi-user cards

Lastly, comes the concept for the multi-user cards, which require groups of audience members to come together and communicate to 'play' them correctly. The impact these collaborative actions will have are going to be some of the largest on the composition, for example changing to a new 'song', or part of the arrangement, or the main tempo.

A small group (around four people) are all shown the same card, and instructed to go and find one another in the space. Then they have to all act together in unison to play the card.

## Development

We settled on this idea quickly and began building the front-end to match.

First to change was the slider controls, which we replaced with accelerometer input - because it's much more fun! Also gone were the toggle features, replaced instead with separate cards for 'turn X on' and 'off'. Sometimes too much control is a bad thing.

The multi-user card prototype changed to a code puzzle, where each member of the group is given a labelled button (from a choice of four) to push and a 'number in line', the idea being that once the group meets, they need to all press their respective buttons in the correct order to proceed.

![Development Screenshots](project_images/Dynamics-cards-screenshots-small.jpg?raw=true "Development Screenshots")

Also of note here are the background graphics, which is a slightly modified version of R Cecco (of [Professor Cloud]('http://www.professorcloud.com', 'Professor Cloud'))'s fantastic canvas 'nebula' effect.