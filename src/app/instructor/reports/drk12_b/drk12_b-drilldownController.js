angular.module( 'instructor.reports')
    .controller('Drk12Drilldown', function($scope, $state, $window, $stateParams, myGames, defaultGame, gameReports, ReportsService, Drk12Service, usersData) {
        $scope.skills = Drk12Service.skills;
        $scope.missionNumber = $stateParams.mission;

        ////////////////////// Get Initially Needed Values/Variables
        $scope.selectedSkill = $stateParams.skill;

        $scope.courses.selected = $scope.courses.options[$stateParams.courseId];
        $scope.selectedStudent = $scope.courses.selected.users.find(function(student) { return student.id === Number($stateParams.studentId); });

        var selectedStudentData = usersData.students.find(function(student) { return student.userId === Number($stateParams.studentId); });

        $scope.selectedMission = selectedStudentData.missions.find(function(missionObject) { return "" + missionObject.mission === "" + $stateParams.mission; });

        //////////////////// Magic Data of Various Sorts ////////////////////////////////////////
        var magicSkillValues = [
            {
                key: "connectingEvidence",
                skills: [
                    {
                        key: "AUTHORITRON",
                        description: "AUTHORITRON",
	                    subDescription: "Authority"
                    },
                    {
                        key: "OBSERVATRON",
                        description: "OBSERVATRON",
	                    subDescription: "Observation"
                    },
                    {
                        key: "CONSEBOT",
                        description: "CONSEBOT",
	                    subDescription: "Consequence"
                    },
                    {
                        key: "COMPARIDROID",
                        description: "COMPARIDROID",
	                    subDescription: "Comparison"
                    }
                ]
            },
            {
                key: "supportingClaims",
                skills: [
	                {
		                key: "FUSE_CORE",
		                description: "Evidence",
                        subDescription: "Built core arguments using relevant and supporting evidence"
	                },
                    {
                        key: "CORE_ATTACK",
                        description: "Contradictory",
                        subDescription: "Attacked irrelevant and contradictory evidence in opponent core arguments"
                    }
                ]
            },
            {
                key: "criticalQuestions",
                skills: [
                    {
                        key: "AUTHORITRON",
                        description: "AUTHORITRON",
                        subDescription: "Authority"
                    },
                    {
                        key: "OBSERVATRON",
                        description: "OBSERVATRON",
                        subDescription: "Observation"
                    },
                    {
                        key: "CONSEBOT",
                        description: "CONSEBOT",
                        subDescription: "Consequence"
                    },
                    {
                        key: "COMPARIDROID",
                        description: "COMPARIDROID",
                        subDescription: "Comparison"
                    }
                ]
            },
            {
                key: "usingBacking",
                skills: [
                    {
                        key: "CREATED",
                        description: "Created",
                        subDescription: "Chose appropriate backing to strengthen a core argument"
                    },
                    {
                        key: "DEFENDED",
                        description: "Defended",
                        subDescription: "Correctly used backing to respond to critical questions"
                    }
                ]
            }
        ];

        var magicDataIdValues = {
            4202: "EXPERT scientists say insects are the BEST protein source for life on Mars.",
            4203: "Hale Ferrus, an EXPERT geologist, says iron in the soil makes Mars look red.",
            4205: "Jebb Ale, a fish EXPERT, says raising fish is our ONLY good choice for our protein source.",
            4207: "Our AUTHORITY on food strategy says soy is the ONLY right solution to our protein needs.",
            4209: "One of our RESPECTED chefs, Jay Ngian, says turtle soup is best served cold.",
            4212: "Mrs. Eerie is an AUTHORITY on food sources. She says the only sensible idea is to raise insects!",
            4358: "Cooking school chefs OBSERVED crickets shed their exoskeletons.",
            4359: "A CONSEQUENCE of using soy beans is they can make fake meat products and ice cream healthier.",
            4360: "Arni Pez, a Tofu Kung Fu cookoff EXPERT, says soy is the ONLY logical protein source.",
            4361: "A good CONSEQUENCE of using insects for protein is we'll save space.",
            4362: "IF we raise fish for protein, THEN we can use their bones to fertilize our soil.",
            4363: "Dr. Peshe is a health food EXPERT. She thinks our ONE protein source should be fish.",
            4364: "Our AUTHORITY in nutrition says we should ONLY raise fish for protein.",
            4365: "Our AUTHORITY on language said help-bots understand most everything we say.",
            4366: "EXPERT machine language scientists say newer robots understand all human language.",
            4367: "Ann Arc OBSERVED a help-bot giving directions after she asked it how to get to the bank.",
            4368: "One student OBSERVED her new help-bot read and shop for everything on her grocery list.",
            4369: "Academy EXPERTS say robots understand people about as well as a piece of toast.",
            4370: "Marta OBSERVED a help-bot punch someone who asked for a sock.",
            4371: "The EXPERT Committee on Languages decided robots will never understand what they say.",
            4372: "A worker SAW a help-bot bring an old band-aid after being asked for a piece of tape.",
            4373: "Many EXPERT programmers say it doesn't matter if help-bots really understand us or not.",
            4374: "IF we stopped investigating whether help-bots understand us, THEN we could solve other problems.",
            4375: "IF we stopped researching what help-bots understand, THEN we'd have more time for other projects.",
            4376: "A leading research EXPERT says we should stop trying to understand if help-bots understand us.",
            4377: "The Academy EXPERT on manners says to thank robots just like we would a human.",
            4378: "IF help-bots can't navigate, THEN it's risky to rely on them in emergencies.",
            4379: "One CONSEQUENCE of using help-bots is you can get more done.",
            4380: "One engineer OBSERVED help-bots run for twelve hours without a recharge.",
            4381: "IF we stopped debating how many help-bots to make, THEN we could talk about more important things.",
            4382: "AUTHORITIES of the Talk Show Association claim bots on their talk shows understand us.",
            4383: "Some Academy language EXPERTS think it's impossible for robots to understand us.",
            4384: "One engineer OBSERVED that her help-bot understands 100% of what she says.",
            4385: "The cafeteria manager OBSERVED a help-bot bring noodles when asked for soy milk.",
            4401: "Jane - a well known animal trainer - says a pet dog is the BEST choice for Mars.",
            4402: "A result of getting a pet dog is it will be more helpful than other animals.",
            4403: "People that get a pet dog will have more fun than if they had a different pet.",
            4404: "The President of the Mars Pet Society said box turtles make the BEST pets.",
            4405: "A pet turtle will help people feel more relaxed at home than if they had a parrot or dog.",
            4406: "When people get a parrot, it will become better friends with them than any other pet would.",
            4407: "The Pet Society Director says parrots are the ONLY pets for Mars.",
            4408: "Art Fester has studied animals for 20 years and he says most camels have funny legs.",
            4409: "When you have a pet dog it will keep you company more than any other pet.",
            4410: "People have witnessed dogs lowering their body temperature when they breath hard.",
            4411: "Owning  dog - instead of a parrot or turtle - will lead people to feel happier about life.",
            4412: "Jake saw that his box turtle's shell didn't harden until it was seven years old.",
            4413: "Our top veterinarian says some parrots can do more complicated tricks than other parrots.",
            4414: "One result of owning a box turtle is you'll have to give it foods in high calcium.",
            4415: "One student saw a friend was happy to replace her dog and parrot with a turtle.",
            4416: "If you get a dog you'll end up putting a leash on it.",
            4419: "Ace Venturo knows everything about pets and says getting a parrot is the BEST choice.",
            4485: "People do better work when they choose what to do.",
            4486: "Most students say they master argubot building by their third year.",
            4487: "Students who graduate in two years could start working sooner.",
            4489: "The Argubot Academy doubled its size over the last three years.",
            4490: "A training expert says students are ready to graduate only after three years.",
            4491: "12% of the Academy's teens fix 2 argubots before they graduate.",
            4492: "A survey shows students value most of their robot design skills.",
            4493: "The President says students should not graduate before they master robotics.",
            4494: "98% of Academy students master robot design in their first year.",
            4495: "Our learning specialist says students should graduate quickly when they can.",
            4496: "The Academy will run out of space if students take too long to graduate.",
            4507: "The Academy will need more robotics students if teens choose what they study.",
            4508: "Brackett City will fail if students can choose where they study.",
            4509: "78% of Brackett City's teens say they care most about helping people succeed.",
            4510: "Brackett City's designer says teens should choose what they study.",
            4511: "The Academy's best animal biologist says we should ONLY have dogs for pets.",
            4512: "The Academy's Director of Safety says pet dogs are the ONLY pets we should have.",
            4513: "By getting a dog, we'll exercise more than if we had a turtle or a parrot.",
            4514: "Our chief animal biologist says that out of all the pets, turtles are the BEST choice.",
            4515: "By getting a turtle from Earth, kids will have more fun playing with it than any other pet.",
            4516: "Families that get pet turtles will have more fun at home than they would if they had any other animal.",
            4517: "Having a turtle will help kids learn more about animals than they would if they had any other pet.",
            4518: "A nice result of having parrots for pets is that they are more fun to train than any other animal.",
            4519: "Leaders of the Pet Association report parrots are the BEST pets for families.",
            4520: "The Academy's top animal trainer says parrots are the BEST pets for Mars.",
            4521: "Unlike owning pets like dogs and turtles, one result of getting a parrot is you will never get lonely.",
            4526: "Engineer Marna Loop, an AUTHORITY on robots, says they follow 96% of our commands.",
            4527: "A help-bot was OBSERVED washing the trash when asked to make lunch.",
            4528: "Computer EXPERTS say we should stop researching how much help-bots understand.",
            4532: "People have OBSERVED that insects have what is called a compound eye.",
            4660: "Our AUTHORITY on food chemistry claims early chewing gum came from tree sap.",
            4665: "We'll have more injuries as a CONSEQUENCE of having teens get around on skateboards",
            4666: "Several people have OBSERVED that moving sidewalks on Earth have moving parts.",
            4672: "Hale Cann is an AUTHORITY on recycling. He says we should reuse old shoes for potting plants.",
            4673: "Our gardening authority says we should try growing cabbage on Mars next.",
            4676: "A consequence of raising corn is it will need more water than we have.",
            4677: "Observations of pea plants show they are a leafy vine.",
            4678: "Cabbage grows best in loose soil, says our authority on vegetables.",
            4683: "One student observed several argubots had been left behind in our last emergency.",
            4684: "One authority claimed the research equipment should be polished and cleaned regularly.",
            4685: "Our entertainment authority claims we should create kareoke systems first.",
            4686: "Many people could make new friends as a consequence of creating board games to play.",
            4688: "A consequence of singing kareoke is people often feel embarrassed in front of their friends.",
            4690: "Our authority on plants says root vegetables can be added to salads and soups.",
            4691: "The Academy's EXPERT musician says the best instrument to learn is the ukelele.",
            4696: "EXPERT musicians say they like playing songs that make people dance.",
            4697: "Our sport EXPERT said that Muhammed Ali was the best athlete of all time.",
            4701: "My mailman will get new shoelaces IF Archie Buncare is recognized as the best all time golfer.",
            4704: "Students will only be inspired to become engineers IF it is kept at the Academy entrance.",
            4705: "Lace Walker FOUND a spot in the shoe closet that is the perfect size for the trophy.",
            4706: "The first thing people SENSE in the shoe closet is its unique and unpleasant smell.",
            4707: "The Academy's janitor will comb his hair IF the mushrooms are kept by the entrance.",
            4708: "Our HISTORIAN says the Engineering Department has won seven awards.",
            4710: "One researcher OBSERVED people were happier when they played board games together.",
            4711: "A CONSEQUENCE of playing games together is that people will become friends.",
            4714: "Improved moods will be one CONSEQUENCE of holding a checker contest.",
            4715: "Our AUTHORITY on healthy competition says checker contests are the best way to go.",
            4716: "OBSERVERS found people have the most fun competing in checkers.",
            4717: "One CONSEQUENCE of competing in checkers is improved strategic thinking.",
            4718: "Brackett City's AUTHORITY on water says we should limit the amount of water people can use.",
            4719: "Our OBSERVATIONS show people waste less water when they have a limited amount they can use.",
            4720: "One CONSEQUENCE of limiting the amount of water people use is we'll be less likely to run out of it.",
            4721: "The Health and Safety AUTHORITY claims people should use less water.",
            4722: "Routine OBSERVATIONS show Brackett City is running low on water.",
            4723: "Brackett-City can create an emergency water supply as a CONSEQUENCE of limiting people's water use.",
            4724: "The conservation AUTHORITY says we should cut people's water use by one half.",
            4726: "A CONSEQUENCE of limiting water use is we'll have more water to use for plant research.",
            4727: "The Bracket City AUTHORITY on happy living says we should learn to make artificial versions of popular foods.",
            4728: "Several OBSERVATIONS show people feel better when they have things that remind them of home.",
            4729: "A CONSEQUENCE of making artificial peanut butter and jelly sandwiches is that people will feel less homesick for Earth.",
            4730: "The Society of Sandwich AUTHORITIES claim researchers should find ways to make PB&J on Mars.",
            4731: "Several reports have OBSERVED people asking for peanut butter and jelly at the local deli.",
            4732: "A CONSEQUENCE of inventing artificial peanut butter and jelly sandiwches is that even kids with peanut allergies will be able to eat them.",
            4733: "AUTHORITIES at the Good Lunch Association say making peanut butter and jelly sandwiches on Mars should be our top research goal.",
            4734: "The women's bowling champions OBSERVED local bowlers wishing they had peanut butter and jelly to put on their bread.",
            4735: "If we can invent a way to make peanut butter and jelly on Mars, a CONSEQUENCE will be happier kids.",
            4736: "Our community living EXPERT claims people in Brackett City need more privacy and space.",
            4737: "One Brackett City resident SAW people were less tense when they had places to be alone.",
            4739: "Brackett City EXPERTS say people need more living spaces where they can have privacy.",
            4740: "Researchers have HEARD that people need 1.2 square feet more room than they now have at Brackett City.",
            4741: "IF there is more living space in Brackett City, THEN there will be fewer arguments.",
            4743: "Reporters have SEEN many people getting upset because Brackett City is so crowded.",
            4745: "Alex Parlar - a technology EXPERT - wants to replace the broken satellites we use to send messages.",
            4746: "One engineer SAW that our satellite signals from Earth are half as strong as they used to be.",
            4747: "IF we create more living space in Brackett City, THEN we could have more people living here.",
            4748: "Our best communications EXPERTS say we have too few satellites.",
            4749: "Engineers have WITNESSED many parts fail on our old satellites.",
            4750: "WITH newer satellites THEN we'll be able to send and receive messages to Earth faster.",
            4752: "We have SEEN evidence of slower communications using our older satellites.",
            4753: "Only IF we build faster satellites will we THEN be able to have clearer communication with Earth.",
            4755: "A reporter HEARD several people saying they were upset that some people got more water than they did.",
            4756: "IF everyone gets equal resources on Mars, THEN there will be fewer arguments.",
            4757: "Our top fairness EXPERTS claim everyone should get the same amount of water and food.",
            4758: "Several people SAW arguments break out becuse someone got more food than they did.",
            4760: "People with the MOST EXPERIENCE claim we should all be treated the same.",
            4761: "The security guard HEARD people worrying they would not get enough water and food.",
            4762: "IF everyone gets the same amount of money and materials, THEN they will feel more secure living in Brackett City.",
            4763: "The City's Director of Energy is sure we'll soon have an energy shortage and that we need more power.",
            4764: "Looking at the city's solar panels it is clear they make less energy than they used to.",
            4767: "Researchers have seen several labs have to stop working because of a lack of power.",
            4768: "With more electricity, we'll be able to run our research labs seven days per week.",
            4769: "\"The city will need to double its electricity output by next year!\" said the head electrician.",
            4770: "Several residents have seen their neighbors shut off their lights so they would have more power on the weekend.",
            4771: "A result of not creating more electricity will be that we can no longer let people run their lights at night.",
            4776: "Workers saw that the solar panels make only a fraction of the electricity the city needs during certain months of the year.",
            4777: "With new sources of electricity, the city would be able to grow.",
            4779: "During dust storms mechanics saw the solar panels generate only half the electricity they usually make.",
            4780: "Life in Brackett City will be more secure with many sources of electricity.",
            4781: "Our equipment manager is well respected and believes city residents do not spend enough time maintaining equipment.",
            4782: "Several engineers have seen equipment failures that could have been avoided with the right maintenance.",
            4784: "The most experienced mechanics believe we need to double the time spent caring for Brackett City's equipment.",
            4787: "Our most respected engineers claim the city's equipment will need at least 1,000 hours of work to get them back into top condition.",
            4789: "When more care is taken to fix the city's equipment, then people will feel safer.",
            4791: "A student group was OBSERVED protesting to be able to visit Earth.",
            4792: "Our family counseling EXPERT says people need to visit their families on Earth.",
            4796: "Visiting Earth again would be COMPARABLE to taking an pleasant sea voyage in the 1800s.",
            4798: "In the last trip to Earth people were OBSERVED returning to Mars because the trip was so difficult.",
            4803: "Students were OBSERVED spending ore time studying for classes that use video games.",
            4806: "Learning with video games can be COMPARED to talking to a friend when you go jogging - it makes hard work more fun.",
            4807: "OBSERVATIONS show students learn to build argubots faster when they build real bots.",
            4808: "Gal Marsean - learning EXPERT - says students need to make real bots not play games.",
            4809: "A CONSEQUENCE of learning on real bots, is students do better work when they graduate.",
            4811: "A big improvement in your reaction time is a CONSEQUENCE of playing Temple Run.",
            4812: "As a CONSEQUENCE of playing Minecraft, many kids develop creativity and tenacity.",
            4813: "A CONSEQUENCE of playing SimCityEDU is improved understanding of how cities work.",
            4814: "One CONSEQUENCE of brushing your teeth often is that you develop fewer cavities.",
            4815: "A CONSEQUENCE of playing chess is long awkward silences.",
            4816: "Game EXPERT Christy Marx thinks Temple Run is the most exciting game there is.",
            4817: "Bo Riggle - a video game AUTHORITY - says Minecraft is the ONLY awesome antique video game.",
            4818: "Our AUTHORITY on fun says SimCityEDU is the ONLY vintage game that kids will enjoy.",
            4819: "Betty White, an AUTHORITY on entertainment, says television can be an art.",
            4820: "One game AUTHORITY - DR. S. Hoyle - says Temple Run puts people to sleep.",
            4821: "!!NEED DATA!!",
            4827: "OBSERVATIONS of the robot's records SHOW it acted like a hero to save the engineers' lives.",
            4828: "OBSERVATIONS SHOW the robot knowingly faced dangerous radiation so he could save the engineers.",
            4829: "Al Clive is an AUTHORITY on robots and says we should treat robot Ike like a hero.",
            4831: "IF we make robot Ike a hero, THEN more kids will get interested in robotics.",
            4832: "A CONSEQUENCE of making Ike the robot a hero is engineers will build better robots.",
            4833: "Ike acted JUST LIKE human heroes - he faced risks to save others.",
            4834: "OBSERVATIONS showed the robot's programs malfuctioned when he saved the engineers.",
            4835: "The robotics software EXPERT says Ike just needs to be reprogrammed.",
            4836: "Jane Lo, EXPERT Chief of Robotics, says reprogramming Ike is all that needs to happen.",
            4837: "One CONSEQUENCE of reprogramming Ike is that he won't malfunction that way again.",
            4838: "A CONSEQUENCE of just reprogramming Ike is we'll have another working rescubot.",
            4839: "Reprogramming robots is JUST LIKE reminding people of the rules - both people and robots need to be reminded.",
            4840: "One rescubot manager OBSERVED the rescubots were poorly designed.",
            4841: "Our robotics AUTHORITY - Dr. Lo - said to redesign all rescubots.",
            4842: "IF we redesign all rescubots, THEN they'll all get needed updates.",
            4843: "Redesigning the bots IS JUST LIKE getting a car a new engine, they run like new.",
            4844: "The security team OBSERVED Lucas leave the city with his shoes untied.",
            4845: "Kara Tram - EXPERT in training engineers - says Lucas should stay on Mars but leave his position.",
            4846: "JR Coop is an authority on security and says Lucas should have to take a different position on Mars.",
            4847: "IF Lucas has to take a different position in the settlement, THEN others won't break the rules.",
            4848: "A CONSEQUENCE of Lucas changing his position is others will know they should not take risks just to save robots.",
            4849: "Destroying valuable equipment to save a robot IS LIKE throwing away old chewing gum.",
            4850: "The guard on duty SAW Lucas getting tools and a suit from the supply room.",
            4851: "El Hartfelt is an EXPERT in space law and she says Lucas should be returned to Earth.",
            4852: "A CONSEQUENCE of sending Lucas to Earth is he won't cause any more trouble here.",
            4853: "A CONSEQUENCE of returning Lucas to Earth is others won't take risks to save robots.",
            4854: "Other engineers OBSERVED that no one is as committed to the robots than Lucas.",
            4855: "Al Clive is an AUTHORITY on robots and says we should reward Lucas.",
            4856: "Lon Channi is an EXPERT. He says Lucas understands robots and should be rewarded.",
            4857: "One CONSEQUENCE of rewarding Lucas is others will take better care of robots.",
            4858: "IF Lucas is rewarded for his commitment, THEN people will understand robots have feelings too.",
            4859: "One CONSEQUENCE of rewarding Lucas is it's the ONLY decision people will agree with.",
            4860: "Lucas is JUST LIKE animal rights activists that were rewarded for saving animals on Earth.",
            4861: "According to our mechanics' OBSERVATIONS, half of our filters have broken parts.",
            4862: "One engineer OBSERVED our water pumps are clogged and working poorly.",
            4863: "Ed Clensail is our maintenance AUTHORITY. He says we need 30% more time to maintain our equipment.",
            4864: "Anne Topwrench is an engineering AUTHORITY. She says maintenance should be our ONLY priority.",
            4865: "One CONSEQUENCE of maintaining our equipment is that it will last longer.",
            4866: "As a CONSEQUENCE of maintaining our equipment, we'll spend less time replacing it later.",
            4867: "Maintaining equipment is JUST LIKE exercising our bodies - if we take care of the equipment, it will work better.",
            4868: "Our OBSERVATIONS show there are many important research questions that need to be answered.",
            4869: "Gale Tuhmara is an AUTHORITY on space travel, and says we should ONLY focus on research.",
            4870: "Alex Sourwind - AUTHORITY on scientific research - said our first priority should be doing research on how to live on Mars.",
            4871: "As a CONSEQUENCE of doing more research, we'll be able to make the city safer for people.",
            4872: "A good CONSEQUENCE of doing more research is that we'll learn more about living on Mars.",
            4873: "Doing more research can be COMPARED to emergency planning - it helps us prepare better for living on Mars.",
            4874: "Residents OBSERVED they feel more at home on Mars when they spend time getting to know each other.",
            4875: "Steve Costa - AUTHORITY on community living - says we ought to spend our time getting to know each other.",
            4876: "Fran Mor, AUTHORITY on friendship, claims our first priority should be getting to know each other better.",
            4877: "One good CONSEQUENCE of spending more time together is that we'll all get along better.",
            4878: "A CONSEQUENCE of spending more time together is that people will work better as a team.",
            4879: "Creating stronger community is COMPARABLE to learning a new language - people get closer by being together and talking.",
            4880: "IF we do more research, THEN we'll be able to make our city on Mars safer.",
            4881: "Checker contests are COMPARABLE to sports tournaments, they bring people together.",
            4882: "Checker contests can be COMPARED to birthday parties - both are good places to make friends.",
            4885: "Limiting the water people use can be COMPARED to putting money in the bank.",
            4889: "Being able to get PB&J on Mars can be COMPARED to giving people a week's vacation on Earth.",
            4890: "Having enough space is JUST LIKE having enough air to breathe - both are necessary.",
            4891: "Our need for space IS THE SAME AS our need for food and water - we can't live without them.",
            4892: "Not giving people enough space IS A LOT LIKE putting them in prison.",
            4893: "Having more satellites will be JUST LIKE we're living on Earth again.",
            4894: "Having more satellites would be LIKE moving Earth closer to Mars.",
            4895: "Having more satellites would make communications on Mars JUST LIKE they are on Earth.",
            4896: "Sharing resources equally is JUST LIKE being in a family.",
            4897: "Being sure everyone has the same resources is the SAME AS giving people a fair share.",
            4898: "When people don't have equal resources, it's THE SAME AS saying some people deserve more than others.",
            4899: "Making more energy and friends are similar because you can never have too many friends.",
            4900: "Having more electricity will feel like we have more robots around because we'll get more done.",
            4901: "Having too little electricity is the same as living in the dark ages.",
            4902: "Solar panels are similar to submarines - they only work in some environments.",
            4903: "Depending on our solar panels is like having to rely on an old car - you can never be sure of when it will work.",
            4904: "Having other sources of power is the same as having a security blanket - we'll feel safer.",
            4909: "!!NEED DATA!!",
            4911: "Our expert beauty expert says using cinnamon toothpaste is not good for your skin.",
            4918: "!!NEED DATA!!",
            4930: "For some people, wearing sandals at home feels JUST LIKE you're walking on mud and rocks - it's not nice.",
            4932: "One CONSEQUENCE of wearing sandals around the house is they leave strange looking patterns on your feet.",
            4935: "Star Fuller is an authority on neuroscience and says why it's unclear why people first started making footwear.",
            4959: "Hobbies can be compared to brief vacations - people feel rejuvenated afterward.",
            4966: "Putting the trophy at the entrance would be LIKE recognizing everyone's hard work.",
            4970: "Jane Greer, the EXPERT on human longevity, says humans should live as long as they can.",
            4971: "The Long Life Society OBSERVED that humans who live a long time are happier.",
            4972: "IF humans live a long time, THEN they may put a strain on the environment.",
            4973: "Putting more people on Earth is JUST LIKE squeezing clowns into a clown car. Eventually there is no more room.",
            4974: "A study by the Earth Protection League OBSERVED that higher populations of humans put a strain on the planet.",
            4975: "Jerry Zigg, the top AUTHORITY on swiss cheese, says high quality milk produces the best results.",
            4976: "IF humans lived forever, THEN they might be able to invent new sources of clean energy.",
            4977: "Peele Dyson, the EXPERT on astronomy, says humans should live forever to explore the stars.",
            4978: "Lion tamer Elyse Viotti thinks that it is very important to maintain a lion's nutrition in captivity.",
            4979: "IF we use fish, a CONSEQUENCE will be allergic reactions for some people.",
            4980: "Getting a puppy instead of a parrot or turtle is the same as getting a loving new member in your family.",
            4981: "Owning a parrot instead of a dog or a turtle is similar to making a new friend.",
            4982: "Many naturalists have recorded sounds of lions roaring at night.",
            4983: "When we built the space elevator to Earth, it allowed supplies to be sent into orbit inexpensively.",
            4984: "Being in love is like visiting a low density planet; your feet feel light as air.",
            4985: "The head of EPA thinks that we need to carefully preserve the remaining living species on Earth.",
            4986: "Stephen Toulmin, cretor of the Toulmin Model, says that argumentation is important to learn.",
            4987: "Studies have shown that kids who learn argumentation convince their parents more often.",
            4988: "When argumentation is taught in school, recess disagreements are resolved more peacefully.",
            4989: "Learning argumentation is like putting a filing cabinet in your brain: it organizes your thoughts.",
            4990: "Jill heard reasoning being used to persuade Sally to eat healthier lunches.",
            4991: "Michael John knows a lot about yaks, and he says many Tibetan people enjoy yak butter tea."
        };

        var magicClaimIdValues = {
            3202: "Brackett City should raise fish for food.",
            3203: "Brackett City should raise soybeans for food.",
            3204: "Brackett City should raise insects for food.",
            3315: "Yes. The engineers' new helpbots can understand language.",
            3316: "The engineers' new helpbots can't really understand what we say.",
            3317: "Stop trying to figure out if help-bots understand us.",
            3318: "We should choose a dog for the Academy pet.",
            3319: "We should choose a turtle for the Academy pet.",
            3320: "We should choose a parrot for the Academy pet.",
            3353: "Students should be able to graduate in two years instead of three.",
            3354: "Teens should stay in the Academy as long as it takes to master argubot engineering.",
            3357: "Students should be able to choose what they study in Brackett City.",
            3359: "Cinnamon flavored toothpaste is the best.",
            3360: "Bubblegum flavor toothpaste is the best.",
            3361: "Toast flavor toothpaste is the best.",
            3362: "Academy students should ride skateboards.",
            3363: "Academy students should use moving sidewalks.",
            3364: "Academy students should just walk.",
            3365: "People should wear socks to relax at home.",
            3366: "People should wear sandals to relax at home.",
            3367: "People should wear shoes to relax at home.",
            3368: "We should experiment with growing cabbage next.",
            3369: "We should try to grow corn next.",
            3370: "We should try to grow peas next.",
            3371: "We should save the planting system first in an emergency.",
            3372: "In an emergecy we should save the argubots first.",
            3373: "We should save the research equipment first.",
            3374: "We should invest in making a Kareoke system first.",
            3375: "We should make board games for people to play.",
            3376: "We need classes for making flower arrangements.",
            3377: "The ukelele is the best instrument to learn.",
            3378: "The best instrument to learn is the trombone.",
            3379: "People should learn to play the guitar.",
            3380: "Muhammed Ali was the best athlete in history.",
            3381: "The best athlete ever was Willie Mays.",
            3382: "Pele was the world's best athlete.",
            3383: "Keep the engineering trophy in the engineering department.",
            3384: "The Academy's entrance is the best place for the trophy.",
            3385: "It's best to keep the engineering trophy in the shoe closet.",
            3386: "Yes. People should be able to visit Earth!",
            3387: "No. People should not be able to visit Earth!",
            3388: "Temple Run is the best classic video game of all time!",
            3389: "Minecraft is the best classic video game of all time!",
            3390: "SimCityEDU is the best classic video game of all time!",
            3393: "Yes, video games should be used on school.",
            3394: "No, video games aren't as good as other school activities.",
            3395: "Ike the rescubot is a hero, honor the robot.",
            3396: "Reprogram Ike the rescubot.",
            3397: "Redesign all the rescubots!",
            3398: "Lucas should have to leave his position at the Academy.",
            3399: "Lucas should have to return to Earth.",
            3400: "Lucas should be recognized for his commitment.",
            3401: "We should spend more time maintaining equipment.",
            3402: "We should spend more time on research.",
            3403: "We should spend more time with the community."
        };

        var magicAttackIdValues = {
            101: "How do you know that person is an authority?",
            102: "Do other authorities agree?",
            103: "Are there other interpretations of the observations?",
            104: "Do you have more observations to support your claim?",
            105: "How sure are we that consequence will happen?",
            106: "Aren't there other consequences we should consider?",
            107: "Are there enough similarities between the two situations?",
            108: "Are there important differences between the things you're comparing?"
        };

        $scope.progressTypes = { // TODO: This is redundant. Move to service.
            Advancing: {class:'Advancing', title: 'Advancing'},
            NeedSupport: {class:'NeedSupport', title: 'Needs Support'},
            NotYetAttempted: {class:'NotAttempted', title: 'Not yet attempted / Not enough data'}
        };

        ////////////////////////////////////////////////////////////

        var getUpdatedMissionDetails = function(mission, skillKey) {
            var selectedMagicDataSkill = magicSkillValues[0];
            switch (skillKey) {
                case magicSkillValues[0].key:
                    selectedMagicDataSkill = magicSkillValues[0];
                    break;
                case magicSkillValues[1].key:
                    selectedMagicDataSkill = magicSkillValues[1];
                    break;
                case magicSkillValues[2].key:
                    selectedMagicDataSkill = magicSkillValues[2];
                    break;
                case magicSkillValues[3].key:
                    selectedMagicDataSkill = magicSkillValues[3];
                    break;
            }

            var returnObject = {};
            if (!mission.skillLevel[selectedMagicDataSkill.key].detail) {
                mission.skillLevel[selectedMagicDataSkill.key].detail = {}; // because sometimes I don't get what I need from the back end
            }
            var missionDetails = mission.skillLevel[selectedMagicDataSkill.key].detail;

            selectedMagicDataSkill.skills.forEach(function(subSkill) {
                // Special one-off horrible hack for FUSE_CORE. Need to show it in skill 2, but it comes from the server as part of skill 1.
                if (subSkill.key === magicSkillValues[1].skills[0].key) {
                    if (!mission.skillLevel[magicSkillValues[0].key].detail) { // because sometimes I don't get what I need from the back end
                        mission.skillLevel[magicSkillValues[0].key].detail = {};
                    }
                    missionDetails[subSkill.key] = mission.skillLevel[magicSkillValues[0].key].detail[subSkill.key];
                }
                if (missionDetails[subSkill.key] === undefined) {
                    missionDetails[subSkill.key] = { correct: 0, attempts: 0};
                }
                missionDetails[subSkill.key].description = subSkill.description;
	            missionDetails[subSkill.key].subDescription = subSkill.subDescription;
	            missionDetails[subSkill.key].locked = true;

	            if (selectedStudentData.argubotsUnlocked[subSkill.key]) {
                    if (typeof selectedStudentData.argubotsUnlocked[subSkill.key] === "string") {
                        if (selectedStudentData.argubotsUnlocked[subSkill.key] === "ST") {
                            missionDetails[subSkill.key].locked = false;
                        } else if (selectedStudentData.argubotsUnlocked[subSkill.key] === "BT" && (mission.mission === "BT" || mission.mission > 6)) { // TODO: Better magic number solution
                            missionDetails[subSkill.key].locked = false;
                        }
                    } else if (typeof selectedStudentData.argubotsUnlocked[subSkill.key] === "number") {
                        if (mission.mission === "BT" && selectedStudentData.argubotsUnlocked[subSkill.key] > 6) { // TODO: Better magic number solution
                            missionDetails[subSkill.key].locked = false;
                        } else if (mission.mission !== "ST" && mission.mission >= selectedStudentData.argubotsUnlocked[subSkill.key]) {
                            missionDetails[subSkill.key].locked = false;
                        }
                    } else {
                        console.error('argubotsUnlocked invalid state. Mission: ', mission.mission, " Unlocked: ", selectedStudentData.argubotsUnlocked[subSkill.key]);
                    }
                } else {
                    missionDetails[subSkill.key].locked = false;
                }
                returnObject[subSkill.key] = missionDetails[subSkill.key];
            });

            return returnObject;
        };

        $scope.dataIdToMagicString = function(dataId) {
            return magicDataIdValues[dataId];
        };

        $scope.claimIdToMagicString = function(claimId) {
            return magicClaimIdValues[claimId];
        };

        $scope.attackIdToMagicString = function(attackId) {
            return magicAttackIdValues[attackId];
        };

        $scope.isFirstSkill = function() {
            return $scope.selectedSkill === magicSkillValues[0].key;
        };

        $scope.isSecondSkill = function() {
            return $scope.selectedSkill === magicSkillValues[1].key;
        };

        $scope.isThirdSkill = function() {
            return $scope.selectedSkill === magicSkillValues[2].key;
        };

        $scope.isFourthSkill = function() {
            return $scope.selectedSkill === magicSkillValues[3].key;
        };

        $scope.numberOfSubSkills = function(object) {
            return Object.keys(object).length;
        };

        $scope.calculateSuccessRate = function(correct, attempts) {
            if (attempts === 0) {
                return "-";
            } else {
                return "" + ((correct/attempts)*100).toFixed(0) + "%";
            }
        };

        $scope.calculdatedDetails = getUpdatedMissionDetails($scope.selectedMission, $scope.selectedSkill);

        ///////////////////////// Necessary stuff for parent drop-downs
        var reportId = 'drk12_b';

        // Games
        $scope.games.options = {}; // TODO: This appears to be report agnostic. Why is it placed in each report?
        angular.forEach(myGames, function(game) { // TODO: This appears to be report agnostic. Why is it placed in each report?
            $scope.games.options['' + game.gameId] = game;
        });

        $scope.games.selectedGameId = defaultGame.gameId; // TODO: This appears to be report agnostic. Why is it placed in each report?


        // Reports
        $scope.reports.options = [];  // TODO: This appears to be report agnostic. Why is it placed in each report?

        angular.forEach(gameReports.list, function(report) { // TODO: This appears to be report agnostic. Why is it placed in each report?
            if(report.enabled) {
                $scope.reports.options.push( angular.copy(report) );
                // select report that matches this state
                if (reportId === report.id) {
                    $scope.reports.selected = report;
                }
            }
        });

        // Check if selected game has selected report

        if (!ReportsService.isValidReport(reportId, $scope.reports.options))  { // TODO: This appears to be report agnostic. Why is it placed in each report?
            $state.go('root.reports.details.' + ReportsService.getDefaultReportId(reportId, $scope.reports.options), {
                gameId: $stateParams.gameId,
                courseId: $stateParams.courseId
            });
            return;
        }

        $window.scrollTo(0, 0);

        // Set parent scope developer info

        if (gameReports.hasOwnProperty('developer')) { // TODO: This appears to be report agnostic. Why is it placed in each report?
            $scope.developer.logo = gameReports.developer.logo;
        }

        ////////////////// End Necessary stuff for parent drop-downs

    });
