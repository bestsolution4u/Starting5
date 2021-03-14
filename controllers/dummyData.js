
//Dummy videos
export const video1 = "https://starting5cdn.azureedge.net/tempvideos/flight-sim-takeoff.mp4";
export const video2 = "https://starting5cdn.azureedge.net/tempvideos/flight-sim-landing.mp4";
export const video3 = "https://starting5cdn.azureedge.net/tempvideos/walking-clouds.mp4";
export const video4 = "https://starting5cdn.azureedge.net/tempvideos/noisy-waves.mp4";

//Community Activities
export const makeBedActivity = {activity_id: 11, activity_focus: "C", activity_title: "Make Your Bed", activity_blurb: "Just making your bed will get your day started.", duration: "2 minutes", complete: false, liked: false, activity_info_text_1: "", activity_info_text_2: "", activity_info_text_3: "", task: [{activity_title: "Task 1", media_image: null, media_link: null, text_src: null, other_src: null}, {activity_title: "Task 2", media_image: null, media_link: video3, text_src: null, other_src: null}]};
export const callActivity = {activity_id: 12, activity_focus: "C", activity_title: "Call A Family Member", activity_blurb: "Call a close friend or family member.", duration: "90 minutes", complete: false, liked: false, activity_info_text_1: "", activity_info_text_2: "", activity_info_text_3: "", task: [{activity_title: "Task 1", media_image: null, media_link: null, text_src: null, other_src: null}]};
export const tvActivity = {activity_id: 13, activity_focus: "C", activity_title: "Yell at the TV", activity_blurb: "Watch a horror movie and yell at the TV.", duration: "120 minutes", complete: false, liked: true, activity_info_text_1: "", activity_info_text_2: "", activity_info_text_3: "", task: [{activity_title: "Task 1", media_image: null, media_link: null, text_src: null, other_src: null}, {activity_title: "Task 2", media_image: null, media_link: video3, text_src: null, other_src: null}]};

export const communityActivities = [makeBedActivity, callActivity, tvActivity];
//Body Activities
export const runActivity = {activity_id: 1, activity_focus: "B", activity_title: "Go for a Run", activity_blurb: "Run at least 5km today.", duration: "7 minutes", complete: false, liked: false, activity_info_text_1: "", activity_info_text_2: "", activity_info_text_3: "",  task: [{activity_title: "Task 1", media_image: null, media_link: video4, text_src: null, other_src: null}]};
export const walkActivity = {activity_id: 2, activity_focus: "B", activity_title: "Go for a Walk", activity_blurb: "Walk at least 7km today.", duration: "30 minutes", complete: false, liked: true, activity_info_text_1: "", activity_info_text_2: "", activity_info_text_3: "", task: [{activity_title: "Task 1", media_image: null, media_link: video1, text_src: null, other_src: null}, {activity_title: "Task 2", media_image: null, media_link: video3, text_src: null, other_src: null}]};
export const hiitActivity = {activity_id: 3, activity_focus: "B", activity_title: "HIIT Workout", activity_blurb: "Follow this HIIT workout", duration: "10 minutes", complete: false, liked: false, activity_info_text_1: "", activity_info_text_2: "", activity_info_text_3: "", task: [{activity_title: "Task 1", media_image: null, media_link: video2, text_src: null, other_src: null}]};

export const bodyActivities = [runActivity, walkActivity, hiitActivity];
//Food Activities
export const moodFoodActivity = {activity_id: 4, activity_focus: "F", activity_title: "Cook This Healthy Kale", activity_blurb: "Big Kale are paying us to say this, we know nobody actually likes it.", duration: "30 minutes", complete: false, liked: false, activity_info_text_1: "", activity_info_text_2: "", activity_info_text_3: "", task: [{activity_title: "Task 1", media_image: null, media_link: video4, text_src: null, other_src: null}, {activity_title: "Task 2", media_image: null, media_link: video3, text_src: null, other_src: null}]};
export const heartyFoodActivity = {activity_id: 5, activity_focus: "F", activity_title: "Cook This Hearty Meal", activity_blurb: "A-grade Kobe beef mignons with truffle salad.", duration: "90 minutes", complete: false, liked: true, activity_info_text_1: "", activity_info_text_2: "", activity_info_text_3: "", task: [{activity_title: "Task 1", media_image: null, media_link: video3, text_src: null, other_src: null}]};
export const naughtyFoodActivity = {activity_id: 6, activity_focus: "F", activity_title: "Order This Naughty Food", activity_blurb: "Opens the MenuLog app and searches for pizza shops that deliver to your area. Bla bla blah blah blah Opens the MenuLog app and searches for pizza shops that deliver to your area. Bla bla blah blah blah ", duration: "0 minutes", complete: false, liked: false, activity_info_text_1: "", activity_info_text_2: "", activity_info_text_3: "", task: [{activity_title: "Task 1", media_image: null, media_link: null, text_src: null, other_src: null}, {activity_title: "Task 2", media_image: null, media_link: video3, text_src: null, other_src: null}]};

export const foodActivities = [moodFoodActivity, heartyFoodActivity, naughtyFoodActivity];
//Mind Activities
export const meditateActivity = {activity_id: 7, activity_focus: "M", activity_title: "Meditation", activity_blurb: "Follow along with a short meditation", duration: "2 minutes", complete: false, liked: true, activity_info_text_1: "", activity_info_text_2: "", activity_info_text_3: "", task: [{activity_title: "Task 1", media_image: null, media_link: null, text_src: null, other_src: null}]};
export const breathingActivity = {activity_id: 8, activity_focus: "M", activity_title: "Breathing", activity_blurb: "Easy breathing exercise", duration: "8 minutes", complete: false, liked: true, activity_info_text_1: "", activity_info_text_2: "", activity_info_text_3: "", task: [{activity_title: "Task 1", media_image: null, media_link: null, text_src: null, other_src: null}, {activity_title: "Task 2", media_image: null, media_link: video3, text_src: null, other_src: null}]};
export const telepathyActivity = {activity_id: 0, activity_focus: "M", activity_title: "Telepathy", activity_blurb: "Use telepathy to win a game of poker.", duration: "90 minutes", complete: false, liked: false, activity_info_text_1: "", activity_info_text_2: "", activity_info_text_3: "", task: [{activity_title: "Task 1", media_image: null, media_link: null, text_src: null, other_src: null}]};

export const mindActivities = [meditateActivity, breathingActivity, telepathyActivity];
//S5 Skills Activities
export const journalActivity = {activity_id: 9, activity_focus: "S", activity_title: "Journal", activity_blurb: "Update your S5 Journal", duration: "3 minutes", complete: false, liked: false, activity_info_text_1: "", activity_info_text_2: "", activity_info_text_3: "", task: [{activity_title: "Task 1", media_image: null, media_link: null, text_src: null, other_src: null}, {activity_title: "Task 2", media_image: null, media_link: video3, text_src: null, other_src: null}]};
export const waterActivity = {activity_id: 10, activity_focus: "S", activity_title: "Drink Water", activity_blurb: "Drink 2 litres of water", duration: "0 minutes", complete: false, liked: true, activity_info_text_1: "", activity_info_text_2: "", activity_info_text_3: "", task: [{activity_title: "Task 1", media_image: null, media_link: null, text_src: null, other_src: null}]};
export const faceActivity = {activity_id: 14, activity_focus: "S", activity_title: "DIY Face Mask", activity_blurb: "The refreshing kind of face mask.", duration: "60 minutes", complete: false, liked: false, activity_info_text_1: "", activity_info_text_2: "", activity_info_text_3: "", task: [{activity_title: "Task 1", media_image: null, media_link: null, text_src: null, other_src: null}, {activity_title: "Task 2", media_image: null, media_link: video3, text_src: null, other_src: null}]};

export const s5SkillsActivities = [journalActivity, waterActivity, faceActivity];

export const quotes = [
    {text:"Habits are not a finished line to be crossed, they are a lifestyle to be lived",author:"James Clear"},
    {text:"Motivation is what gets you started. Habit is what keeps you going",author:"Jim Ryun"},
    {text:"We Are What We Repeatedly Do. Excellence Then, Is Not An Act, But a Habit",author:"Aristotle"},
    {text:"In a Nutshell, your Health, Wealth, Happiness, Fitness, and Success Depend on your Habits",author:"Joanna Hast"},
    {text:"Your Habits form your Character",author:"Unknown"},
    {text:"Each choice starts a behaviour that over time becomes a habit",author:"Darren Hardy"},
    {text:"The habit I formed of counting my blessing each morning is one of the most precious possessions",author:"OG Mandino"},
    {text:"The chains of habit are too weak to be felt until they are too strong to be broken",author:"Samuel Johnson"},
    {text:"Ignore the bad habit and put your energy toward building a new habit that will override the old one",author:"Daneil Coyle"},
    {text:"If I really want to improve my situation, I can work on the one thing over which I have control - myself",author:"Stephen Covey"},
    {text:"Enthusiasm is the electricity of life. How do you get it? You act enthusiastic until you make it a habit",author:"Gordon Parks"},
    {text:"Mental Health is like a relationship. You can't cheat and expect it to work",author:"Unknown"},
    {text:"The secret of your future is hidden in your daily routine",author:"Unknown"},
    {text:"The thing that is really hard, and really amazing, is giving up on being perfect and beginning the work of becoming yourself.",author:"Anna Quindlen"},
    {text:"When you feel like quitting, think about why you started",author:"Unknown"},
    {text:"What lies behind us and what lies ahead of us are tiny matters compared to what lies within us",author:"Ralph Waldo Emerson"},
    {text:"Champions aren't just born; Champions can be made when they embrace and commit to life changing positive habits",author:"Lewis Howes"},
    {text:"You will never change your life until you change something you do daily",author:"Mike Murdock"},
    {text:"One of the most common causes of failure is the habit of quitting when one is overtaken by temporary defeat",author:"Napoleon Hill"},
    {text:"You have power over your mind - not outside events. Realize this, and you will find strength",author:"Marucs Aurelius"},
    {text:"Once you learn to quit, it becomes a habit",author:"Vince Lombardi"},
    {text:"Quality is not an act, it is a habit",author:"Aristotle"},
    {text:"Make it your habit to not be critical about small things",author:"Edward Everett Hale"},
    {text:"People who make their bed in the morning are 19 percent more likely to have a good night's sleep, every night",author:"National Sleep Foundation (April, 2020)"},
    {text:"Making your bed every morning is correlated with better productivity, a greater sense of well-being, and strong skills at sticking with a budget",author:"Charles Duhigg"},
    {text:"Making your bed every morning gives you a feeling of accomplishment, creates a positive state of mind as you go to bed, lowers your stress, and leads to other good habits",author:"Jennifer Wasylenko"},
    {text:"If you wanna change the world, start off by making your bed. If you made your bed every morning you will have accomplished the first task of the day. It will give you a small sense of pride",author:"William McRaven"},
    {text:"A change in bad habits leads to a change in life",author:"Jenny Craig"},
    {text:"You'll never change your life until you change something you do daily. The secret of your success is found in your daily routine",author:"John C. Maxwell"},
    {text:"Practice isn't the thing you do once you're good. It's the thing you do that makes you good",author:"Malcom Gladwell"},
    {text:"Successful people are simply those with successful habits",author:"Brian Tracy"},
    {text:"Never miss twice. If you miss one day, try to get back on track as quickly as possible",author:"James Clear"},
    {text:"Habit will sustain you whether you're inspired or not",author:"Octavia Butler"},
    {text:"There is no elevator to success, you have to take the stairs",author:"Zig Ziglar"},
    {text:"Bad habits are like a comfortable bed, easy to get into, but hard to get out of",author:"Wishes Quotes"},
    {text:"One bad habit often spoils a dozen good ones",author:"Napoleon Hill"},
    {text:"A great habit for self-growth is routinely making and breaking habits",author:"Colin Wright"},
    {text:"Good habits are worth being fanatical about",author:"John Irving"},
    {text:"Good habits are as addictive as bad habits, and a lot more rewarding",author:"Harvey MacKay"},
    {text:"Make good habits and they will make you",author:"Parks Cousins"},
    {text:"You cannot change your future, you can change your habits. And surely your habits will change your future",author:"Quotes Pictures"},
    {text:"An unfortunate thing about this world is that the good habits are much easier to give up than the bad ones",author:"W. Somerset Maugham"},
    {text:"It doesn't really matter who I used to be. All that matters is who I have become",author:"Unknown"},
    {text:"There's nothing you can't do if you get the habits right",author:"Charles Duhigg"},
    {text:"Your habits decide your future",author:"Unknown"},
    {text:"Discipline is the bridge between goals and accomplishment",author:"Jim Rohn"},
    {text:"We first make our habits, and then our habits make us",author:"John Dryden"},
    {text:"Small healthy habits add up and compound into a better quality of life",author:"Michael D'Aulerio"},
    {text:"You leave old habits behind by starting with the thought, I release the need for this in my life",author:"Wayne Dyer"},
    {text:"Give up being perfect for being authentic",author:"Hal Elrod"},
    {text:"The habit of gratitude is matched by the universe habitually giving you what you want",author:"MMA quotable"},
    {text:"Habit is a cable; we can weave a thread each day, and at last we cannot break it",author:"Horace Mann"},
    {text:"In essence, if we want to direct our lives, we must take control of our consistent actions. It's not what we do that shapes our lives, but what we do consistently",author:"Tony Robbins"},
    {text:"Chains of habit are too light to be felt until they are too heavy to be broken",author:"Warren Buffet"},
    {text:"The secret of change is to focus all of your energy, not on fighting the old, but on building the new",author:"Socrates"},
    {text:"Habits and routine have an unbelievable power to waste and destroy",author:"Henri de Lubac"},
    {text:"Our lives are a work in progress. We can't rush into changing our habits. Take a few steps at a time and enjoy the process",author:"PositiveMotivation.net"},
    {text:"Believe you can and you're halfway there",author:"Theodore Roosevelt"},
    {text:"Stop beating yourself up. You are a work in progress. Which means you get there a little at a time, not all at once",author:""},
    {text:"I'm not trying to look perfect, I just want to feel better, look great, know i'm healthy and be able to smile",author:"Unknown"},
    {text:"You're off to great places, today is your day. Your mountain is waiting so get on your way",author:"Dr. Seuss"},
    {text:"Facing it, always facing it, that's the way to get through. Face It",author:"Joseph Conrad"},
    {text:"Look for something positive in each day, even if some days you have to look a little harder",author:"Boomsumo.com"},
    {text:"Being positive won't guarantee you'll succeed. But being negative will guarantee you won't",author:"Jon Gordon"},
    {text:"Every day may not be good, but there is something good in every day",author:"Everyday Power"},
    {text:"Your mind is a powerful thing, when you fill it with positive thoughts, your life will start to change",author:"Baba Alexander"},
    {text:"Dreams are not something to wait for, they are something to work for",author:"Unknown"},
    {text:"If you care about something enough, you'll find a way to make it happen",author:"Unknown"},
    {text:"Wake up every morning with the thought that something wonderful is about to happen",author:"Unknown"},
    {text:"Just because something isn't happening right now, doesn't mean that it will never happen",author:"Unknown"},
    {text:"I know I'm good for something, I just haven't found it yet",author:"Unknown"},
    {text:"Do something today that your future self will thank you for",author:"Unknown"},
    {text:"When something is gone, something better is coming",author:"Unknown"},
    {text:"Every morning you have two choices: Continue to sleep with your dream, or wake up and chase them",author:"Unknown"},
    {text:"It is during our darkest moments that we must focus to see the light",author:"Aristotle"},
    {text:"The secret to permanently breaking any bad habits is to love something greater than the habit",author:"Bryant McGill"},
    {text:"Education is for improving the lives of others and for leaving your community and world better than you found it",author:"Marian Wright Edelman"},
    {text:"Healthy habits are learned in the same way as unhealthy ones - through practice",author:"Wayne Dyer"},
    {text:"You cannot always control what goes on outside. But you can always control what goes on inside",author:"Wayne Dyer"},
    {text:"Simple, consistent good habits lead to a life full of bountiful blessings",author:"Richard G. Scott"},
    {text:"4 Good Habits - create daily, learn daily, love daily, move daily",author:"LeAura Alderson"},
    {text:"Who is strong? Those that can conquer their bad habits",author:"Benjamin Franklin"},
    {text:"It is health that is real wealth and not pieces of gold and silver",author:"Mahatma Gandhi"},
    {text:"A healthy outside starts from the inside",author:"Robert Urich"},
    {text:"Progress is progress no matter how small",author:"Unknown"},
    {text:"Every small step is progress",author:"Unknown"},
    {text:"Work hard in silence, let your success be your noise",author:"Yuri Elkaim"},
    {text:"Take care of your body. It's the only place you have to live",author:"Jim Rohn"},
    {text:"Failure is not the opposite of success. It is a part of success",author:"Unknown"},
    {text:"Fitness is not about being better than someone else. It's about being better than you used to be",author:"Unknown"},
    {text:"You are a victim of the rules you live by",author:"Jenny Holzer"},
    {text:"You can start out with nothing, and out of nothing, and out of no way, a way will be made",author:"Reverend Michael Bernard"},
    {text:"If you are depressed, you are living in the past. If you are anxious, you are living in the future. If you are at peace, you are living in the present",author:"Lao Tzu"},
    {text:"Waiting to be someone else is a waste of the person you are",author:"Kurt Cobain"},
    {text:"If we really love ourselves, everything in our life works",author:"Louise Hay"},
    {text:"It is better to be hated for who you are than to be loved for what you are not",author:"Andre Gide"},
    {text:"You are never alone or helpless. The force that guides the stars guides you too",author:"Shrii Shrii Anandamurti"},
    {text:"When you are grateful, fear disappears and abundance appears",author:"Anthony Robbins"},
    {text:"In order to kick ass you must first lift up your foot",author:"Jen Sincero"},
    {text:"I have lived a long life and had many troubles, most of which never happened",author:"Mark Twain"},
    {text:"What mental health needs is more sunlight, more candor, more unshamed conversation",author:"Glenn Close"},
    {text:"Start where you are. Use what you have. Do what you can",author:"Arthur Ashe"},
    {text:"My dark days made me stronger. Or maybe I already was strong, and they made me prove it",author:"Emery Lord"},
    {text:"I think and think and think. I've thought myself out of happines one million times, but never once into it",author:"Johathan Safran Foer"},
    {text:"When we deny our stories, they define us. When we own our stories, we get to write a brave new ending",author:"Bren Brown"},
    {text:"You are more precious to this world than you'll ever know",author:"Lili Rhinehart"},
    {text:"It's so important that we all speak up on mental health",author:"Anne-Marrie"},
    {text:"I am still me, no matter my mental health",author:"Niki McBain"},
    {text:"There is hope, even when your brain tells you there isn't",author:"John Green"},
    {text:"It's Okay not to be Okay",author:"Unknown"},
    {text:"You were born to be real. Not to be perfect",author:"Proudly Imperfect"},
    {text:"Happines can be found, even in the darkest of time, if one only remembers to turn on the light",author:"J. K. Rowling"},
    {text:"Our mental seriously affects our physical health. So there should be no stigma around mental health, none at all",author:"Michelle Obama"},
    {text:"Live as if you were to die tomorrow. Learn as if you were to live forever",author:"Mahatma Gandhi"},
    {text:"In a gentle way, you can shake the world",author:"Mahatma Gandhi"},
    {text:"If you can sit with your pain, listen to your pain and respect your pain - in time you will move through your pain",author:"Bryant McGill"}
]
    
    