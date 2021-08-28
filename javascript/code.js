// Global variables
let donationMessage = $("#enough");
let startValX = 250;
let startValY = 460;
let pointArray = [];
let pointValueXArray = [];
let pointValueYArray = [];
let liquidWidth = 300;
let numPoints = 10;
let videoContainer = document.querySelector("video");
let videoDiv = document.querySelector("#video");
let isPlaying = false;
let heartbeat = document.querySelector("audio");

// Timelines
const water_rise = gsap.timeline();
const glass_pulse = gsap.timeline();
const wwf_info = gsap.timeline().pause();
const change_div = gsap.timeline();
let banner = gsap.timeline();
let videoPlay = gsap.timeline();

// Document ready
$(document).ready(function () {
    donationMessage.hide();
});

// Select all polypoints
let select = (s) => document.querySelector(s),
    selectAll = (s) => document.querySelectorAll(s),
    mainSVG = select(".mainSVG"),
    liquid = select("#liquid"),
    allBubbles = selectAll("#bubbleGroup rect");

// set mainSVG visible
gsap.set(mainSVG, {
    visibility: "visible",
});
for (let i = 0; i < numPoints; i++) {
    let p = liquid.points.appendItem(mainSVG.createSVGPoint());
    pointArray.push(p);
    pointValueXArray.push(i < numPoints - 2 ? startValX : 400);
    startValX += liquidWidth / (numPoints - 2);
    pointValueYArray.push(i < numPoints - 2 ? startValY : 800);
}

// Set water Starting point
gsap.set(pointArray, {
    x: gsap.utils.wrap(pointValueXArray),
    y: gsap.utils.wrap(pointValueYArray),
});

// bubble animation TL
gsap.set("#bubbleGroup rect", {
    transformOrigin: "50% 50%",
});
gsap.fromTo(
    allBubbles,
    {
        x: "random(0, 180)",
        y: "random(0,80)",
        scale: "random(1, 5)",
        rotation: "random(20, 180)",
        opacity: 1,
    },
    {
        duration: 1,
        rotation: "random(180, 360)",
        repeatRefresh: true,
        stagger: {
            each: 0.52,
            repeat: -1,
        },
        scale: 0.5,
        y: "-=150",
        opacity: 0.1,
    }
).seek(100);

// Define water rising level TL
water_rise
    .to(pointValueYArray, {
        endArray: [250, 250, 250, 250, 250, 250, 250, 250, 800, 800],
    })
    .to(pointArray, {
        duration: 10,
        x: gsap.utils.wrap(pointValueXArray),
        y: gsap.utils.wrap(pointValueYArray),
    });

// Define changing div TL
change_div
.fromTo(
    "#banner_info",
    {
        autoAlpha: 0,
        duration: 1,
        onstart: function () {
            heartbeat.volume = 1;
        },
    },
    {
        autoAlpha: 1,
        duration: 1,
        background: "#ffffff",
        onComplete: function () {
            heartbeat.volume = 0;
            wwf_info.resume();
        },
    });

// glass_pulse TL
glass_pulse
    .to(
        ".mainSVG",
        {
            duration: 1.5,
            scale: 1.5,
            repeat: 5,
            ease: Back.easeInOut,
            yoyoEase: true,
            onStart: function () {
                heartbeat.play();
            },
        },
        0
    )
    .to(".mainSVG", {
        scale: 1.5,
        autoAlpha: 0,
        duration: 2,
    })
    // Add water_rise  Tween
    .add(water_rise, 0)
    // Glass almost full Tween
    .fromTo(
        ".theGlass",
        {
            autoAlpha: 0,
            duration: 2,
        },
        {
            autoAlpha: 1,
            duration: 1.5,
        }
    )
    .fromTo(
        ".almostFull",
        {
            autoAlpha: 0,
            duration: 1.5,
        },
        {
            autoAlpha: 1,
            duration: 2,
        }
    )
    .to(".theGlass, .almostFull", {
        autoAlpha: 0,
        duration: 2,
    })
    // Time running out Tween
    .fromTo(
        ".runningOut",
        {
            autoAlpha: 0,
            duration: 2,
        },
        {
            autoAlpha: 1,
            duration: 1.5,
        }
    )
    .to(".runningOut", {
        autoAlpha: 0,
        duration: 2,
    })
    .to(
        "#banner",
        {
            ease: Power0.easeInOut,
            duration: 1,
            autoAlpha: 0,
        },
        20
    )
    .add(change_div, 20);

// WWF Logo timelime
wwf_info
    .fromTo(
        "#wwf_logo",
        {
            autoAlpha: 0,
            duration: 1,
        },
        {
            autoAlpha: 1,
            duration: 2,
        }
    )
    .to("#wwf_logo", {
        scale: 0.4,
        top: "-10%",
        duration: 0.7,
        ease: Power2.easeOut,
    })
    .to(
        "#donate",
        {
            duration: 2,
            autoAlpha: 1,
        },
        2
    )
    .to(
        ".landing_greeting",
        {
            duration: 2,
            autoAlpha: 1,
            onComplete: function () {
                // Keydown event for video
                window.addEventListener("keydown", function (j) {
                    // Check if Shift-Key is pressed and isPlaying === false to start video
                    if (j.shiftKey && isPlaying === false) {
                        // Check if variable is undefined and prevent error
                        if (!banner || !videoPlay) {
                            console.log("Nothing more to see");
                            return;
                        }
                        banner.fromTo(
                            "#banner_info",
                            {
                                autoAlpha: 1,
                                duration: 1.5,
                            },
                            {
                                autoAlpha: 0,
                                duration: 1.5,
                            }
                        );
                        videoPlay.fromTo(
                            videoDiv,
                            {
                                autoAlpha: 0,
                                duration: 1.5,
                            },
                            {
                                autoAlpha: 1,
                                duration: 1.5,
                            }
                        );
                        // Play video
                        videoContainer.play();
                        // Set isPlaying = true
                        isPlaying = true;
                        // Hide Landing greeting
                        setTimeout(function () {
                            $(".landing_greeting").hide();
                            $(".more").hide();
                        }, 1500);
                    }
                    // Check if Shift-Key is pressed and isPlaying === true to stop video
                    else if (j.shiftKey && isPlaying === true) {
                        // Check if variable is undefined and prevent error
                        if (!banner || !videoPlay) {
                            console.log("Nothing more to see");
                            return;
                        }
                        banner.fromTo(
                            "#banner_info",
                            {
                                autoAlpha: 0,
                                duration: 1.5,
                            },
                            {
                                autoAlpha: 1,
                                duration: 1.5,
                            }
                        );
                        videoPlay.fromTo(
                            videoDiv,
                            {
                                autoAlpha: 1,
                                duration: 1.5,
                            },
                            {
                                autoAlpha: 0,
                                duration: 1.5,
                            }
                        );
                        // Pause video
                        videoContainer.pause();
                        // Set isPlaying = false
                        isPlaying = false;
                    }
                    // fadeIn hidden Donationmessage
                    donationMessage.fadeIn(5000);
                });
            },
        },
        2
    );

// Listen for end of video
videoContainer.addEventListener("ended", endOfVideo, false);
function endOfVideo() {
    setTimeout(function () {
        document.querySelector("#banner_info").style.opacity = "1";
        document.querySelector("#banner_info").style.visibility = "visible";
    }, 500);
    $("#video").fadeOut(1000);
    // Disable playing video again
    banner = undefined;
    videoPlay = undefined;
};

// Donation link to WFF
document.querySelector("#donate").addEventListener("click", () => {
    window.open("https://lp.panda.org/donate", "_blank");
});
