const baseurl = "https://leetcode.com";

async function get_csrf() {
    const cookies_raw = await fetch(`https://leetcode.com/`, {
        headers: {
            "user-agent": "Mozilla/5.0 LeetCode Stats Card",
        },
    }).then((res) => res.headers.get("set-cookie"));
    const csrf_token = cookies_raw
        .split(";")
        .map((x) => x.trim().split("="))
        .find((x) => x[0].includes("csrftoken"))[1];
    return csrf_token;
}

async function leetcode_data(username) {
    let cache_key = new Request(baseurl + "/graphql/" + username);
    let cache = caches.default;

    // check cache
    let response = await cache.match(cache_key);

    if (!response) {
        const csrf_token = await get_csrf();

        response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                origin: "https://leetcode.com",
                referer: `https://leetcode.com/${username}/`,
                cookie: `csrftoken=${csrf_token}; `,
                "x-csrftoken": csrf_token,
                "user-agent": "Mozilla/5.0 LeetCode Stats Card",
            },
            body: JSON.stringify({
                operationName: "getUserProfile",
                variables: { username: username },
                query: `
                query getUserProfile($username: String!) {
                    allQuestionsCount {
                        difficulty
                        count
                    }
                    matchedUser(username: $username) {
                        username
                        socialAccounts
                        githubUrl
                        contributions {
                            points
                            questionCount
                            testcaseCount
                        }
                        profile {
                            realName
                            websites
                            countryName
                            skillTags
                            company
                            school
                            starRating
                            aboutMe
                            userAvatar
                            reputation
                            ranking
                        }
                        submissionCalendar
                        submitStats {
                            acSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                            totalSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                        }
                        badges {
                            id
                            displayName
                            icon
                            creationDate
                        }
                        upcomingBadges {
                            name
                            icon
                        }
                        activeBadge {
                            id
                        }
                    }
                    recentSubmissionList(username: $username, limit: 5) {
                        title
                        titleSlug
                        timestamp
                        statusDisplay
                        lang
                    }
                }
                `,
            }),
        });

        response = new Response(response.body, response);
        response.headers.append("Cache-Control", "s-maxage=60, maxage=60");

        cache.put(cache_key, response.clone());
    }

    const leetcode_data_raw = await response.json();

    return {
        username: leetcode_data_raw.data.matchedUser.username,
        profile: {
            name: leetcode_data_raw.data.matchedUser.profile.realName || null,
            avatar: leetcode_data_raw.data.matchedUser.profile.userAvatar || null,
            about: leetcode_data_raw.data.matchedUser.profile.aboutMe,
            country: leetcode_data_raw.data.matchedUser.profile.countryName || null,
            skills: leetcode_data_raw.data.matchedUser.profile.skillsTags,
            company: leetcode_data_raw.data.matchedUser.profile.company || null,
            school: leetcode_data_raw.data.matchedUser.profile.school || null,
            ranking: leetcode_data_raw.data.matchedUser.profile.ranking,
            reputation: leetcode_data_raw.data.matchedUser.profile.reputation,
        },
        social: {
            website: leetcode_data_raw.data.matchedUser.profile.websites.length ? leetcode_data_raw.data.matchedUser.profile.websites[0] : null,
            github: leetcode_data_raw.data.matchedUser.githubUrl || null,
        },
        contribution: {
            point: leetcode_data_raw.data.matchedUser.contributions.points,
            question: leetcode_data_raw.data.matchedUser.contributions.questionCount,
            testcase: leetcode_data_raw.data.matchedUser.contributions.testcaseCount,
        },
        calendar: JSON.parse(leetcode_data_raw.data.matchedUser.submissionCalendar),
        problem: {
            all: {
                total: leetcode_data_raw.data.allQuestionsCount.find((x) => x.difficulty === "All").count,
                solved: leetcode_data_raw.data.matchedUser.submitStats.acSubmissionNum.find((x) => x.difficulty === "All").count,
            },
            easy: {
                total: leetcode_data_raw.data.allQuestionsCount.find((x) => x.difficulty === "Easy").count,
                solved: leetcode_data_raw.data.matchedUser.submitStats.acSubmissionNum.find((x) => x.difficulty === "Easy").count,
            },
            medium: {
                total: leetcode_data_raw.data.allQuestionsCount.find((x) => x.difficulty === "Medium").count,
                solved: leetcode_data_raw.data.matchedUser.submitStats.acSubmissionNum.find((x) => x.difficulty === "Medium").count,
            },
            hard: {
                total: leetcode_data_raw.data.allQuestionsCount.find((x) => x.difficulty === "Hard").count,
                solved: leetcode_data_raw.data.matchedUser.submitStats.acSubmissionNum.find((x) => x.difficulty === "Hard").count,
            },
        },
        badge: {
            active: leetcode_data_raw.data.matchedUser.activeBadge,
            owned: leetcode_data_raw.data.matchedUser.badges.map((badge) => {
                if (!badge.icon.includes("http")) badge.icon = baseurl + badge.icon;
                return badge;
            }),
            upcoming: leetcode_data_raw.data.matchedUser.upcomingBadges.map((badge) => {
                if (!badge.icon.includes("http")) badge.icon = baseurl + badge.icon;
                return badge;
            }),
        },
        activity: leetcode_data_raw.data.recentSubmissionList.map((submission) => {
            return {
                title: submission.title,
                problem: baseurl + "/problems/" + submission.titleSlug + "/",
                lang: submission.lang,
                time: new Date(parseInt(submission.timestamp) * 1000),
                status: submission.statusDisplay,
            };
        }),
    };
}

export { leetcode_data };
