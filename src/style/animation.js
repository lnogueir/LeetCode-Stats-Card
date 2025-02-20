const animations = `
@keyframes fade_in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
`
    .split("\n")
    .map((line) => line.trim())
    .join(" ");

const animation_style = [
    [
        "#icon",
        {
            opacity: 0,
        },
    ],
    [
        "#username",
        {
            opacity: 0,
        },
    ],
    [
        "#rank",
        {
            opacity: 0,
        },
    ],
    [
        ".circle_bg",
        {
            opacity: 0,
        },
    ],
    [
        ".circle",
        {
            opacity: 0,
        },
    ],
    [
        "#total_solved",
        {
            opacity: 0,
        },
    ],
    [
        "#easy_solved .difficulty",
        {
            opacity: 0,
        },
    ],
    [
        "#easy_solved .solved",
        {
            opacity: 0,
        },
    ],
    [
        "#easy_solved .progress_bg",
        {
            opacity: 0,
        },
    ],
    [
        "#easy_solved .progress",
        {
            opacity: 0,
        },
    ],
    [
        "#medium_solved .difficulty",
        {
            opacity: 0,
        },
    ],
    [
        "#medium_solved .solved",
        {
            opacity: 0,
        },
    ],
    [
        "#medium_solved .progress_bg",
        {
            opacity: 0,
        },
    ],
    [
        "#medium_solved .progress",
        {
            opacity: 0,
        },
    ],
    [
        "#hard_solved .difficulty",
        {
            opacity: 0,
        },
    ],
    [
        "#hard_solved .solved",
        {
            opacity: 0,
        },
    ],
    [
        "#hard_solved .progress_bg",
        {
            opacity: 0,
        },
    ],
    [
        "#hard_solved .progress",
        {
            opacity: 0,
        },
    ],
    [
        "#extension",
        {
            opacity: 0,
        },
    ],
];

for (let i = 0; i < animation_style.length; i++) {
    animation_style[i][1].animation = `fade_in 0.3s ease ${(0.1 * i).toFixed(2)}s 1 forwards`;
}

function circle_animation(selector, len = 0, delay = 0) {
    const R = Math.floor(Math.random() * 1000);
    const animation = `@keyframes circle_${R} { 0% { opacity: 0; stroke-dasharray: 0 1000; } 50% { opacity: 1; } 100% { opacity: 1; stroke-dasharray: ${len} 1000; } }`;
    const style = `${selector} { animation: circle_${R} 1.2s ease ${delay}s 1 forwards }`;
    return animation + style;
}

export { animations, animation_style, circle_animation };
