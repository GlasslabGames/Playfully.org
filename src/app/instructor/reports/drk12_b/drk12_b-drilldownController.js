angular.module( 'instructor.reports')
    .controller('Drk12Drilldown', function($scope, $state, $window, $stateParams, myGames, defaultGame, gameReports, ReportsService, Drk12Service, usersData) {
        $scope.skills = Drk12Service.skills;
        $scope.missionNumber = $stateParams.mission;
        $scope.isFooterOpened = false;
        $scope.isFooterFullScreen = false;

        ////////////////////// Get Initially Needed Values/Variables ////////////////////////////
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
            4101: "Food critic Allen Fromage says strawberry ice cream goes well with all meals.",
            4102: "Carlos Rodriguez is a food chemist and his favorite meal is breakfast.",
            4103: "Doctor Jane Lingua says some people's feet swell when they eat strawberries.",
            4104: "The local grocer refuses to sell strawberry ice cream because no one buys it.",
            4105: "Our local mailman thinks that strawberry ice cream is only good for gluing paper.",
            4106: "Raj Sharma has created an award winning recipe for cheese pie.",
            4107: "Brackett City's top chef says his customers order chocolate ice cream the most.",
            4108: "A local doctor thinks chocolate makes his patients sneeze.",
            4109: "A local food expert says that chocolate ice cream looks better than it tastes.",
            4110: "Biologist Stella Luna, thinks you can make chocolate ice cream from coffee cups.",
            4111: "My local dentist says toothpaste flavor ice cream makes him feel happy.",
            4112: "The local librarian had a birthday party and couldn't give away the toothpaste ice cream.",
            4113: "Brackett City's speed eating champion refuses to eat toothpaste ice cream.",
            4114: "Hai Tran is a historian. He believes ice cream was invented in China.",
            4202: "EXPERT scientists say insects are the BEST protein source for life on Mars.",
            4203: "Hale Ferrus, an EXPERT geologist, says iron in the soil makes Mars look red.",
            4205: "Jebb Ale, a fish EXPERT, says raising fish is our ONLY good choice for our protein source.",
            4207: "Our AUTHORITY on food strategy says soy is the ONLY right solution to our protein needs.",
            4209: "One of our RESPECTED chefs, Jay Ngian, says turtle soup is best served cold.",
            4212: "Mrs. Eerie is an AUTHORITY on food sources. She says the only sensible idea is to raise insects!",
            4292: "OBSERVATIONS show more lab rats die from radiation than from engineered bacteria.",
            4311: "Juggling can improve people's ability to fix complex machines.",
            4312: "People who juggle are used to spending many hours outdoors.",
            4313: "Brackett City teachers want more time to teach robotics.",
            4314: "Engineering courses require students to design new types of robots.",
            4315: "Teen engineers get training on how to fix all the newest types of robots.",
            4316: "On average, adult engineers have 15% less training with newer robot models than teen engineers do.",
            4317: "A set of observers found that adult engineers generally make 12% fewer mistakes than teen engineers.",
            4318: "Teen engineers know the newest techniques for robot design.",
            4319: "There are fewer robots on Mars than there are on Earth.",
            4320: "Teens have fewer accidents at work than adult engineers.",
            4321: "Research shows teens are happiest with their family and friends.",
            4322: "85% of teens on Mars say they would like training on how to improve robot design.",
            4323: "The director of robotics education claims every job on Mars will require people that know the basics of robot repair.",
            4324: "On average, teen engineers have enough time in their day to learn new computer science skills.",
            4325: "Sam Hartful, an expert educator, says that soon everyone will need to be experts in designing, building and repairing robots on Mars.",
            4326: "When teens and adults get paid the same for doing the same jobs, teens improve their skills faster and keep their jobs longer.",
            4327: "Some teen engineers have more experience with Evo3 bots than anything else.",
            4328: "Teen engineers usually know the newest software languages for argubots.",
            4329: "A team studied teen and adult engineers doing the same kinds of jobs. They couldn't tell the difference between the robots adult engineers fixed and the robots teen engineer's fixed.",
            4330: "Teens weren't allowed to join the Engineering Academy until 2025!",
            4331: "One expert robot engineer said, 'This work is tough. When those young engineers can work on the Evo3 bots or they do the same kind of work I do, they should earn the same amount that I earn.'",
            4332: "A review of the engineer worklogs showed that only the top 10% of engineers were skilled enough to build and fix the Brackett City Evo3 argubots.",
            4333: "Only 10% of teen engineers ever finish their engineering training before they are hired to design, build and repair robots.",
            4334: "Adult engineers know all the most popular techniques for robot design.",
            4335: "A research study showed that very few teens save their money.",
            4336: "Few teen engineers have ever worked on robots built on Earth.",
            4337: "One of the leading employers for robot engineers said that most companies won't hire young engineers if they don't have experience working.",
            4338: "If teen engineers can't work while they're in the academy or work with the newest robot models, they'll be unprepared to work when they graduate.",
            4339: "A survey of young engineers showed that only 10% of them were able to get a job after graduating when they didn't have work experience.",
            4340: "Engineering students who had worked on new model robots are 30% more likely to get hired after they graduate than students who haven't worked with the new model robots.",
            4341: "WHEN cows are bred to make more milk, THEN they have more digestive problems.",
            4342: "IF chickens are bred to grow more muscle, THEN they get so big they can't walk.",
            4343: "A CONSEQUENCE of breeding cows now is that they can live shorter lives.",
            4344: "IF they are bred right, THEN some animals take only five weeks to grow enough to eat them.",
            4345: "A CONSEQUENCE of breeding is that we can triple the amount of meat on chickens.",
            4346: "IF cows are bred properly, THEN they can make four times more milk.",
            4347: "IF the right laws are made, THEN people will breed healthier animals for Mars.",
            4348: "A CONSEQUENCE of good laws is people will breed healthy animals that can live on Mars.",
            4349: "WHEN we don't have the right laws, THEN people will breed animals that are less healthy.",
            4350: "Pigs are cheap to feed and as a CONSEQUENCE they are often raised for food.",
            4351: "WHEN animals eat poor quality feed, THEN they tend to eat more.",
            4352: "As a CONSEQUENCE of the weather, turkeys can live in California.",
            4353: "A CONSEQUENCE of breeding animals is they have health problems when they're older.",
            4354: "IF humans like certain plants, THEN they tend to grow a lot of them.",
            4355: "A CONSEQUENCE of better breeding laws is we would raise healthier animals.",
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
            4386: "Researchers OBSERVED new bacteria that cure diabetes, but can't live on Mars.",
            4387: "OBSERVATIONS show a new bacteria recycles metals, but dies on the Mars.",
            4388: "It was SHOWN our new bacteria makes glue but needs more oxygen than Mars has.",
            4389: "Our OBSERVATIONS show people who engineer new bacteria are more likely to get CJ disease.",
            4390: "A city official OBSERVED that two bacteria engineers were diagnosed with hepatitis.",
            4391: "A researcher OBSERVED human cells died when mixed with engineered bacteria.",
            4393: "OBSERVATIONS show ten workers got hurt last year, but none worked in the bacteria lab.",
            4394: "Safety groups OBSERVED more people get hurt opening letters than from engineering bacteria.",
            4395: "Researchers have OBSERVED some bacteria living in boiling water and even radioactive waste.",
            4396: "Before Brackett City, NASA OBSERVED methane gas in Mars' atmosphere.",
            4397: "OBSERVATIONS of rock from Mars show lumps that could be fossilized bacteria.",
            4398: "A new bacteria spilled in the lab, and plants were OBSERVED dying a few days later.",
            4399: "Some OBSERVATIONS show human cells are not harmed when mixed with engineered bacteria.",
            4400: "OBSERVATIONS show engineered bacteria increase production of biofuels by 50% but they die on Mars.",
            4401: "Jane - a well known animal trainer - says a pet dog is the BEST choice for Mars.",
            4402: "A result of getting a pet dog is it will be more helpful than other animals.",
            4403: "People that get a pet dog will have more fun than if they had a different pet.",
            4404: "The President of the Mars Pet Society said box turtles make the BEST pets.",
            4405: "A pet turtle will help people feel more relaxed at home than if they had a parrot or dog.",
            4406: "When people get a parrot, it will become better friends with them than any other pet would.",
            4407: "The Pet Society Director says parrots are the ONLY pets for Mars.",
            4408: "Art Fester has studied animals for 20 years and he says most camels have furry legs.",
            4409: "When you have a pet dog it will keep you company more than any other pet.",
            4410: "People have witnessed dogs lowering their body temperature when they breath hard.",
            4411: "Owning a dog - instead of a parrot or turtle - will lead people to feel happier about life.",
            4412: "Jake saw that his box turtle's shell didn't harden until it was seven years old.",
            4413: "Our top veterinarian says some parrots can do more complicated tricks than other parrots.",
            4414: "One result of owning a box turtle is you'll have to give it foods high in calcium.",
            4415: "One student saw a friend was happy to replace her dog and parrot with a turtle.",
            4416: "If you get a dog you'll end up putting a leash on it.",
            4417: "The Academy's leading vet believes dogs enjoy being indoors and being outdoors too.",
            4419: "Ace Venturo knows everything about pets and says getting a parrot is the BEST choice.",
            4423: "Mai-Jong OBSERVED splinters from ping pong paddles are painful.",
            4424: "Reporters OBSERVED ping pong players exercise more than joggers.",
            4425: "Scientists OBSERVED baseball requires less exercise than golf.",
            4426: "Our AUTHORITIES report some of the best athletes play ping pong.",
            4429: "Several people OBSERVED med-bots are replacing human doctors.",
            4430: "Our OBSERVATIONS show too many people are getting sick or hurt at work.",
            4431: "People do better work as a CONSEQUENCE of exercising and being healthy.",
            4432: "Our health AUTHORITY said most injuries happen when people are at work.",
            4435: "OBSERVATIONS show people are healthier when they only eat healthy food.",
            4436: "IF people are close with their friends THEN they tend to live longer lives.",
            4437: "Our nutrition AUTHORITY claims people should eat limited amounts of food.",
            4438: "EXPERTS agree people should eat small amounts of food and only have healthy food to choose from.",
            4440: "A reporter OBSERVED many of the best athletes only practice 3 times a week.",
            4441: "Dr. K. Ardio - an EXPERT in teen health - says teens should exercise every day.",
            4442: "IF team members exercise together every day, THEN they can concentrate longer.",
            4444: "A CONSEQUENCE of being part of a team, is success at school and work.",
            4448: "AUTHORITY, Dr. K. Ardio,  says unhealthy foods should be made illegal.",
            4449: "A CONSEQUENCE of taxing unhealthy food is people will buy healthier foods instead.",
            4450: "We OBSERVED the only way to help teens get healthier is to ban or tax unhealthy food.",
            4451: "Cooking EXPERTS believe food tastes better when it is organic.",
            4452: "A CONSEQUENCE of taxing unhealthy food is Brackett City will get more money for medical costs.",
            4453: "We OBSERVED robots are out of date ten years after they're built.",
            4454: "A CONSEQENCE of building cheap robot parts is that the robots malfunction.",
            4455: "One engineering AUTHORITY says it takes a robot eleven years to become good at their work.",
            4456: "OBSERVATIONS show batteries for robots are difficult to recharge.",
            4458: "OBSERVATIONS show it's best to fix broken bots as fast as possible.",
            4459: "Sid Eggtrim, is an engineering AUTHORITY, and says old robots should be recycled.",
            4460: "OBSERVATIONS show when bots are fixed quickly they are more likely to perform well.",
            4462: "One engineering AUTHORITY says we should always repair broken robots.",
            4464: "EXPERT robotics engineers say the biggest fear of robot owners is that their bots will be recycled.",
            4465: "Our OBSERVATIONS show we save money by reusing spare parts from broken bots.",
            4466: "A good CONSEQUENCE of recycling broken bots is it makes new robots cheaper to build.",
            4471: "The academy will save large amounts of money by reprogramming broken robots for jobs they can do even when they aren't working well.",
            4472: "There is evidence that some robots believe they are humans too.",
            4473: "A survey showed 78% of robots prefer to stay with their team - no matter how badly they're damaged.",
            4474: "At a company picnic, a team of robots that had been damaged and then reprogrammed won 1st place in the pie eating contest.",
            4475: "Robots are designed to last for a limited amount of time.",
            4476: "Most robots are built in a way that their parts can be reused in other ways.",
            4477: "If it can reprogram broken robots and give them new work assignments in their teams, the Academy will need to make fewer new robots.",
            4478: "A small number of robots are designed so they can be recycled into hockey sticks.",
            4479: "Jay D. Right is an expert in robot ethics, and he claims that because some robots are able to make plans for the future we should let them to choose what they want to do when they're too old for work.",
            4480: "An expert robotics programmer claims that robots can only follow their code and can't make decisions.",
            4481: "The wingnuts used in newer robots are designed to wear out after ten years.",
            4482: "When robots make choices they are programmed to think of what their owners want.",
            4483: "If we let robots choose the work they want to do, there would be no guarantee the robots would be a help in living on Mars.",
            4484: "The Brackett City leader says human teams should be in charge of what their robots do, and when robots retire, the robots should be able to decide what happens to them.",
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
            4497: "The Academy’s Dean says students should go to the academy for three years.",
            4498: "Students who leave early get paid well when they start working.",
            4499: "Test results show 78% of Academy students master robot repair in year 2.",
            4500: "Most Academy students say they love working with argubots.",
            4501: "Only 14% of the Academy’s students have complaints about the school.",
            4502: "Art Wu, a learning expert, says adults can fix robots if they work at it.",
            4503: "Most Academy students say all students should master their personal hygiene.",
            4504: "Abe Recall is a memory expert and says students forget 12% of what they learn.",
            4505: "15% of Academy students receive Superior ratings on their assignments.",
            4506: "Jhi Pan-Da, a teen counselor, says teens should not have to go to the Academy.",
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
            4522: "Worms, viruses and bacteria all come with owning a live pet.",
            4523: "Recreation expert Al Bing, says getting a pet is not a crazy idea.",
            4524: "Marsha Winger says dog food smells like old band aids and toothpicks.",
            4526: "Engineer Marna Loop, an AUTHORITY on robots, says they follow 96% of our commands.",
            4527: "A help-bot was OBSERVED washing the trash when asked to make lunch.",
            4528: "Computer EXPERTS say we should stop researching how much help-bots understand.",
            4532: "People have OBSERVED that insects have what is called a compound eye.",
            4656: "Anne Gumma is an AUTHORITY on dental health. She claims cinnamon is the best flavor for toothpaste.",
            4657: "A CONSEQUENCE of making bubble gum flavored toothpaste is that kids will brush longer.",
            4658: "A resident OBSERVED her friends love the smell of toast when they brush their teeth.",
            4659: "One reporter OBSERVED teens saying cinnamon is too spicy.",
            4660: "Our AUTHORITY on food chemistry claims early chewing gum came from tree sap.",
            4661: "Having bad breath after brushing is a CONSEQUENCE of using toast flavored toothpaste.",
            4662: "Gale Gira is our transit AUTHORITY at the Academy. She says teens should ride skateboards.",
            4663: "One CONSEQUENCE of using moving sidewalks to get around is that people could use them to transport heavy machines too.",
            4664: "OBSERVATIONS show that people that walk more are generally healthier.",
            4665: "We'll have more injuries as a CONSEQUENCE of having teens get around on skateboards.",
            4666: "Several people have OBSERVED that moving sidewalks on Earth have moving parts.",
            4667: "Gabby Plush is a fashion AUTHORITY. She claims people should ONLY wear socks at home.",
            4668: "Fewer toe injuries is one CONSEQUENCE of wearing shoes at home.",
            4669: "Researchers OBSERVED that people are most comfortable in sandals.",
            4670: "People will have to wash their socks more often as a CONSEQUENCE of wearing them around their house.",
            4671: "Anthropologists OBSERVED sandals that were made and worn over 2,500 years ago.",
            4672: "Hale Cann is an AUTHORITY on recycling. He says we should reuse old shoes for potting plants.",
            4673: "Our gardening authority says we should try growing cabbage on Mars next.",
            4674: "Having popcorn again would be a nice consequence of growing corn.",
            4675: "People have observed that peas have more nutrients than other vegetables.",
            4676: "A consequence of raising corn is it will need more water than we have.",
            4677: "Observations of pea plants show they are a leafy vine.",
            4678: "Cabbage grows best in loose soil, says our authority on vegetables.",
            4679: "Emergency planning authorities say we need to rescue our planting equipment first.",
            4680: "A consequence of saving argubots first is we can use them to rebuild after an emergency.",
            4681: "Observations showed the research equipment was our only way to supply air and water in our last emergency.",
            4682: "A consequence of saving the planting system first is we won’t have medical supplies we’ll need.",
            4683: "One student observed several argubots had been left behind in our last emergency.",
            4684: "One authority claimed the research equipment should be polished and cleaned regularly.",
            4685: "Our entertainment authority claims we should create karaoke systems first.",
            4686: "Many people could make new friends as a consequence of creating board games to play.",
            4687: "Observations show people over sixty and under ten enjoy arranging flowers the most.",
            4688: "A consequence of singing karaoke is people often feel embarrassed in front of friends.",
            4689: "Kids have been observed playing board games on Saturdays and Mondays too.",
            4690: "Our authority on plants says root vegetables can be added to salads and soups.",
            4691: "The Academy's EXPERT musician says the best instrument to learn is the ukelele.",
            4692: "IF more people knew how to play the trombone, THEN we could start a marching band!",
            4693: "After talking together, academy music students SAW they all wanted to play guitar.",
            4694: "IF we made trombones on Mars, THEN we’d need materials and tools we do not have.",
            4695: "Evidence of the first ukulele was SEEN in Hawaii.",
            4696: "EXPERT musicians say they like playing songs that make people dance.",
            4697: "Our sport EXPERT said that Muhammed Ali was the best athlete of all time.",
            4698: "IF Willie Mays is made the best athlete of all, THEN he’ll finally get the attention he deserves.",
            4699: "People around the world WITNESSED Pele do things other athletes only dreamed about.",
            4700: "Reporters SAW things that suggested Muhammad Ali wasn’t always in great shape.",
            4701: "My mailman will get new shoelaces IF Archie Buncare is recognized as the best all time golfer.",
            4702: "The PRESIDENT of our shoe factory says Jake Lagazo's name should be put on every pair of shorts.",
            4703: "The Academy’s CHIEF DECORATOR says the trophy should go in the Engineering Department and nowhere else.",
            4704: "Students will only be inspired to become engineers IF it is kept at the Academy entrance.",
            4705: "Lace Walker FOUND a spot in the shoe closet that is the perfect size for the trophy.",
            4706: "The first thing people SENSE in the shoe closet is its unique and unpleasant smell.",
            4707: "The Academy's janitor will comb his hair IF the mushrooms are kept by the entrance.",
            4708: "Our HISTORIAN says the Engineering Department has won seven awards.",
            4709: "Our recreation AUTHORITY claims people should play games like checkers regularly.",
            4710: "One researcher OBSERVED people were happier when they played board games together.",
            4711: "A CONSEQUENCE of playing games together is that people will become friends.",
            4712: "Academy AUTHORITIES say people need a checker contest.",
            4713: "Our OBSERVATIONS show checker contests create interest and excitement.",
            4714: "Improved moods will be one CONSEQUENCE of holding a checker contest.",
            4715: "Our AUTHORITY on healthy competition says checker contests are the best way to go.",
            4716: "OBSERVERS found people have the most fun competing in checkers.",
            4717: "One CONSEQUENCE of competing in checkers is improved strategic thinking.",
            4718: "Brackett City's AUTHORITY on water says we should limit the amount of water people can use.",
            4719: "Our OBSERVATIONS show people waste less water when they have a limited amount they can use.",
            4720: "One CONSEQUENCE of limiting the amount of water people use is we'll be less likely to run out of it.",
            4721: "The Health and Safety AUTHORITY claims people should use less water.",
            4722: "Routine OBSERVATIONS show Brackett City is running low on water.",
            4723: "Brackett City can create an emergency water supply as a CONSEQUENCE of limiting people's water use.",
            4724: "The conservation AUTHORITY says we should cut people's water use by one half.",
            4725: "OBSERVATIONS show some people use 2-3 times their share of water.",
            4726: "A CONSEQUENCE of limiting water use is we'll have more water to use for plant research.",
            4727: "The Brackett City AUTHORITY on happy living says we should learn to make artificial versions of popular foods.",
            4728: "Several OBSERVATIONS show people feel better when they have things that remind them of home.",
            4729: "A CONSEQUENCE of making artificial peanut butter and jelly sandwiches is that people will feel less homesick for Earth.",
            4730: "The Society of Sandwich AUTHORITIES claim researchers should find ways to make PB&J on Mars.",
            4731: "Several reporters have OBSERVED people asking for peanut butter and jelly at the local deli.",
            4732: "A CONSEQUENCE of inventing artificial peanut butter and jelly sandwiches is that even kids with peanut allergies will be able to eat them.",
            4733: "AUTHORITIES at the Good Lunch Association say making peanut butter and jelly sandwiches on Mars should be our top research goal.",
            4734: "The women's bowling champions OBSERVED local bowlers wishing they had peanut butter and jelly to put on their bread.",
            4735: "If we can invent a way to make peanut butter and jelly on Mars, a CONSEQUENCE will be happier kids.",
            4736: "Our community living EXPERT claims people in Brackett City need more privacy and space.",
            4737: "One Brackett City resident SAW people were less tense when they had places to be alone.",
            4738: "IF we create more living space in Brackett City, THEN we could have more people living here.",
            4739: "Brackett City EXPERTS say people need more living spaces where they can have privacy.",
            4740: "Researchers have HEARD that people need 1.2 square feet more room than they now have at Brackett City.",
            4741: "IF there is more living space in Brackett City, THEN there will be fewer arguments.",
            4742: "EXPERTS architects claim Brackett City doesn't have enough room for people to sleep.",
            4743: "Reporters have SEEN many people getting upset because Brackett City is so crowded.",
            4744: "IF people had more space to put their things, THEN there would be less frustration.",
            4745: "Alex Parlar - a technology EXPERT - wants to replace the broken satellites we use to send messages.",
            4746: "One engineer SAW that our satellite signals from Earth are half as strong as they used to be.",
            4747: "IF we create more living space in Brackett City, THEN we could have more people living here.",
            4748: "Our best communications EXPERTS say we have too few satellites.",
            4749: "Engineers have WITNESSED many parts fail on our old satellites.",
            4750: "WITH newer satellites, THEN we'll be able to send and receive messages to Earth faster.",
            4751: "EXPERT satellite engineers claim our old satellites won’t last much longer.",
            4752: "We have SEEN evidence of slower communications using our older satellites.",
            4753: "Only IF we build faster satellites will we THEN be able to have clearer communication with Earth.",
            4754: "Judge Justizio, a top ranked PROFESSIONAL lawyer, says everyone on Mars should have the same resources.",
            4755: "A reporter HEARD several people saying they were upset that some people got more water than they did.",
            4756: "IF everyone gets equal resources on Mars, THEN there will be fewer arguments.",
            4757: "Our top fairness EXPERTS claim everyone should get the same amount of water and food.",
            4758: "Several people SAW arguments break out because someone got more food than they did.",
            4759: "WHEN everyone has equal access to resources, THEN there people will be happier to share what they have.",
            4760: "People with the MOST EXPERIENCE claim we should all be treated the same.",
            4761: "The security guard HEARD people worrying they would not get enough water and food.",
            4762: "IF everyone gets the same amount of money and materials, THEN they will feel more secure living in Brackett City.",
            4763: "The City's Director of Energy is sure we'll soon have an energy shortage and that we need more power.",
            4764: "Looking at the city's solar panels it is clear they make less energy than they used to.",
            4765: "By generating more energy, the people in Brackett City will be safer.",
            4766: "Professional electricians are convinced the city is running short on electricity.",
            4767: "Researchers have seen several labs have to stop working because of a lack of power.",
            4768: "With more electricity, we'll be able to run our research labs seven days per week.",
            4769: "\"The city will need to double its electricity output by next year!\" said the head electrician.",
            4770: "Several residents have seen their neighbors shut off their lights so they would have more power on the weekend.",
            4771: "A result of not creating more electricity will be that we can no longer let people run their lights at night.",
            4772: "A well respected engineer believes the City should build several ways of generating energy.",
            4773: "Someone noticed solar panels create very little energy during the night.",
            4774: "The City risks power shortages during big dust storms if it only uses solar panels to generate electricity.",
            4775: "The Director of Safety Planning claims solar panels are too unreliable to depend on.",
            4776: "Workers saw that the solar panels make only a fraction of the electricity the city needs during certain months in the year.",
            4777: "With new sources of electricity, the city would be able to grow.",
            4778: "Many well respected city planners and engineers are worried that we still depend only on solar power for electricity.",
            4779: "During dust storms mechanics saw the solar panels generate only half the electricity they usually make.",
            4780: "Life in Brackett City will be more secure with many sources of electricity.",
            4781: "Our equipment manager is well respected and believes city residents do not spend enough time maintaining equipment.",
            4782: "Several engineers have seen equipment failures that could have been avoided with the right maintenance.",
            4783: "When people don’t care for their equipment it can malfunction and put people’s lives at risk.",
            4784: "The most experienced mechanics believe we need to double the time spent caring for Brackett City's equipment.",
            4785: "One reporter saw evidence that the city's most important machines were beginning to break down.",
            4786: "With more time spent maintaining them, the city's equipment will last longer.",
            4787: "Our most respected engineers claim the city's equipment will need at least 1,000 hours of work to get them back into top condition.",
            4788: "Several researchers witnessed equipment failures because of old or broken parts.",
            4789: "When more care is taken to fix the city's equipment, then people will feel safer.",
            4790: "Many people were OBSERVED saying they just want to visit friends on Earth for a few days.",
            4791: "A student group was OBSERVED protesting to be able to visit Earth.",
            4792: "Our family counseling EXPERT says people need to visit their families on Earth.",
            4793: "Dr. Ritorno - an AUTHORITY on space medicine - says humans should visit Earth often.",
            4794: "A CONSEQUENCE of being able to visit Earth is that people will be happier to be on Mars.",
            4795: "IF people know they can visit Earth, THEN more people will be willing to live on Mars.",
            4796: "Visiting Earth again would be COMPARABLE to taking a pleasant sea voyage in the 1800's.",
            4797: "OBSERVATIONS show we don't have enough fuel for even two people to visit Earth.",
            4798: "In the last trip to Earth people were OBSERVED returning to Mars because the trip was so difficult.",
            4799: "Ms. Gova, our AUTHORITY on space travel says we can't afford to have anyone travel to Earth.",
            4800: "Jay Safebottom - an EXPERT on security - says traveling to Earth is too dangerous.",
            4801: "IF we allow visits to Earth, THEN we will use up resources we need to survive on Mars.",
            4802: "Letting people visit Earth is COMPARABLE to spending all your time and money on things you don't really need.",
            4803: "Students were OBSERVED spending more time studying for classes that use video games.",
            4804: "Ellen Sapia - a learning AUTHORITY - says the best way to learn about bots is by using learning games.",
            4805: "A CONSEQUENCE of learning with video games is students will be more willing to learn hard content.",
            4806: "Learning with video games can be COMPARED to talking to a friend when you go jogging - it makes hard work more fun.",
            4807: "OBSERVATIONS show students learn to build argubots faster when they build real bots.",
            4808: "Gal Marsean - learning EXPERT - says students need to make real bots not play games.",
            4809: "A CONSEQUENCE of learning on real bots, is students do better work when they graduate.",
            4810: "Practicing on real bots is COMPARABLE to a warm up for the real thing - you learn more about what the work is really like.",
            4811: "A big improvement in your reaction time is a CONSEQUENCE of playing Temple Run.",
            4812: "As a CONSEQUENCE of playing Minecraft, many kids develop creativity and tenacity.",
            4813: "A CONSEQUENCE of playing SimCityEDU is improved understanding of how cities work.",
            4814: "One CONSEQUENCE of brushing your teeth often is that you develop fewer cavities.",
            4815: "A CONSEQUENCE of playing chess is long awkward silences.",
            4816: "Game EXPERT Christy Marx thinks Temple Run is the most exciting game there is.",
            4817: "Bo Riggle - a video game AUTHORITY - says Minecraft is the ONLY awesome antique video game.",
            4818: "Our AUTHORITY on fun says SimCityEDU is the ONLY vintage game that kids will enjoy.",
            4819: "Betty White, an AUTHORITY on entertainment, says television can be art.",
            4820: "One game AUTHORITY - Dr. S. Hoyle - says Temple Run puts people to sleep.",
            4821: "We OBSERVED that people on Earth thought Temple Run was better than any other vintage game.",
            4822: "Playing SimCityEDU is JUST LIKE being Mayor of a real city.",
            4823: "Jill Booth, the AUTHORITY on awesome, SAYS Adrian is the best.",
            4824: "One of Adrian's fans OBSERVED that he is the best there is.",
            4825: "A CONSEQUENCE of Adrian's awesomeness is that we all get to admire him.",
            4826: "Our OBSERVATIONS of Adrian show that he isn't awesome at anything.",
            4827: "OBSERVATIONS of the robot's records SHOW it acted like a hero to save the engineers' lives.",
            4828: "OBSERVATIONS SHOW the robot knowingly faced dangerous radiation so he could save the engineers.",
            4829: "Al Clive is an AUTHORITY on robots and says we should treat robot Ike like a hero.",
            4831: "IF we make robot Ike a hero, THEN more kids will get interested in robotics.",
            4832: "A CONSEQUENCE of making Ike the robot a hero is engineers will build better robots.",
            4833: "Ike acted JUST LIKE human heroes - he faced risks to save others.",
            4834: "OBSERVATIONS showed the robot's programs malfunctioned when he saved the engineers.",
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
            4846: "JR Coop is an AUTHORITY on security and says Lucas should have to take a different position on Mars.",
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
            4863: "Ed Clensall is our maintenance AUTHORITY. He says we need 30% more time to maintain our equipment.",
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
            4883: "Competing in checkers is COMPARABLE to getting exercise for your brain.",
            4884: "Limiting water is COMPARABLE to saving money, we’ll all have more if we use less.",
            4885: "Limiting the water people use can be COMPARED to putting money in the bank.",
            4886: "Saving water can be COMPARED to saving anything - saving will allow you to have more later.",
            4887: "Eating PB&J is COMPARABLE to making a trip home to Earth.",
            4888: "For most people, having a PB&J sandwich is COMPARABLE to reliving their favorite memories.",
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
            4905: "Tasting toast while you brushing would be JUST LIKE eating a meal while cleaning your teeth!",
            4906: "Mouthwash is like perfume - it makes your breath smell good.",
            4907: "Toast flavored toothpaste is like bad medicine - no one in their right mind would use it if they didn't have to.",
            4908: "Using cinnamon flavored toothpaste is so fun it's like having a dance party in your mouth.",
            4909: "Dr. Al Dente is an experienced dentist and he says bubble gum toothpaste is the best.",
            4910: "Because it's so spicy, if kids use cinnamon toothpaste they won't like brushing their teeth.",
            4911: "Our expert beauty expert says using cinnamon toothpaste is not good for your skin.",
            4912: "A good consequence of brushing your teeth daily is healthier gums.",
            4913: "Tooth brushers on Mars found that using bubblegum toothpaste at night kept them awake.",
            4914: "Moving sidewalks are COMPARABLE to other time saving inventions, people are more productive when they use them.",
            4915: "Riding a unicycle can be COMPARED to riding a bike on one wheel.",
            4916: "When COMPARED to other types of transportation, moving sidewalks are the most dangerous.",
            4917: "A student OBSERVED she slept better once she started riding skateboards.",
            4918: "The transportation AUTHORITY claims moving sidewalks are the ONLY good solution to our problems.",
            4919: "One CONSEQUENCE of walking more is people will have stronger bones as a result.",
            4920: "One woman OBSERVED her joints were sore after walking.",
            4921: "One CONSEQUENCE of riding skateboards will be more joint injuries.",
            4922: "Samuel Jackson - leading AUTHORITY on Mars' geology - says Mars' atmosphere used to be very different.",
            4923: "Wearing socks at home is COMPARABLE to getting a relaxing foot massage.",
            4924: "Wearing high heels can be COMPARED to standing on your toes all day.",
            4925: "Wearing sandals is COMPARABLE to tying your feet up with rope - it's uncomfortable!",
            4926: "Sandra Piede observed that people who wear sandals have healthier feet.",
            4927: "A good CONSEQUENCE of wearing shoes at home is that you can run faster when you need to answer the door.",
            4928: "Our AUTHORITY on beauty care says people should wear shoes at home so people don't have to see their toes.",
            4929: "A nice CONSEQUENCE of just wearing socks at home is you can slide around on smooth floors.",
            4930: "For some people, wearing sandals at home feels JUST LIKE you're walking on mud and rocks - it's not nice.",
            4931: "Kale Putrid - an AUTHORITY on smells - says wearing socks at home only makes your feet sweat.",
            4932: "One CONSEQUENCE of wearing sandals around the house is they leave strange looking patterns on your feet.",
            4933: "Gale Smith OBSERVED her feet did not smell very good after wearing socks at home all day.",
            4934: "Decisions about footwear at home are COMPARABLE to other important fashion choices you make.",
            4935: "Star Fuller is an authority on neuroscience and says it's unclear why people first started making footwear.",
            4936: "Eating cabbage is just like saving money: it's an investment in your health.",
            4937: "Corn is just like the Swiss Army Knife of food: it has many different uses.",
            4938: "Eating peas is like trying to move the ocean with a spoon.",
            4939: "Nutritionists observed that people who ate peas had more energy.",
            4940: "Getting more vitamin K in our diet would be one result of growing and eating cabbage.",
            4941: "Alex Hu - expert vegetable technician - says we should ONLY think about growing peas",
            4942: "We will be able to make more fuel for our generators if we raise corn.",
            4943: "Several students observed that corn got stuck in their teeth and it took days to get it out.",
            4944: "Eating cabbage is much like chewing on thin pieces of cotton shirts - it doesn't have much flavor.",
            4945: "Natural gasses will occur and will be a problem in our tight living spaces if people start eating cabbage.",
            4946: "If we grow plants like bamboo then we'll have a new material to build with.",
            4947: "Observations show people enjoy eating jello more when we cut it into cubes.",
            4948: "Saving the planting system in an emergency would be comparable to risking your life for a pair of old socks.",
            4949: "Saving the argubots in an emergency is comparable to risking your life for things that can be easily replaced.",
            4950: "One student compared emergency rescues with the one-hundred meter dash.",
            4951: "Residents observed the planting system was important in answering several important research questions.",
            4952: "Aicia Parlar - a debate authority - says the most important thing to save will be the argubots.",
            4953: "Once consequence of saving the research equipment is we won't lose all the progress we've made in our labs.",
            4954: "Our authority on accounting says the planting system is the cheapest and easiest to replace if it was destroyed.",
            4955: "People will feel less secure as a consequence of any major disaster on Mars.",
            4956: "Several residents have observed that the much of the research equipment is broken and needs to be replaced.",
            4957: "Singing karaoke with friends is comparable to any of the most fun experiences you've had.",
            4958: "Singing karaoke in front of anybody is comparable to showing up to school with your pants inside out.",
            4959: "Hobbies can be compared to brief vacations - people feel rejuvenated afterward.",
            4960: "When people play the ukulele together it can sound JUST LIKE there is a full band with only two people.",
            4961: "To many, listening to the ukulele is JUST LIKE getting holes drilled in your teeth.",
            4962: "The piano is often compared to other string instruments.",
            4963: "Pele is SIMILAR TO the greatest geniuses of our time - he changed the way people think about the world around them.",
            4964: "In his last few fights, Muhammad Ali moved so slowly he LOOKED LIKE he had iron shoes.",
            4965: "Great sports figures can be compared to successful military leaders.",
            4966: "Putting the trophy at the entrance would be LIKE recognizing everyone's hard work.",
            4967: "Putting the trophy in the shoe closet would be LIKE hiding it - no one will be able to see it.",
            4968: "The trophy is LIKE a symbol of our best accomplishments",
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
            4983: "When we built the space elevator on Earth, it allowed supplies to be sent into orbit inexpensively.",
            4984: "Being in love is like visiting a low density planet: your feet feel light as air.",
            4985: "The head of EPA thinks that we need to carefully preserve the remaining living species on Earth.",
            4986: "Stephen Toulmin, creator of the Toulmin Model, says that argumentation is important to learn.",
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
            1: "Contradictory",
            2: "Irrelevant",
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
                if (missionDetails[subSkill.key] === undefined) {
                    missionDetails[subSkill.key] = { correct: 0, attempts: 0};
                }
                missionDetails[subSkill.key].description = subSkill.description;
	            missionDetails[subSkill.key].subDescription = subSkill.subDescription;
	            missionDetails[subSkill.key].locked = true;

	            if (selectedStudentData.argubotsUnlocked[subSkill.key]) {
	                // DRK-358 per Paula's instructions, if an argubot has been unlocked in any mission, it should appear unlocked in ST and BT missions also.
	                if (mission.mission === "ST" || mission.mission === "BT") {
                        missionDetails[subSkill.key].locked = false;
                    }
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

        $scope.footerHelperClicked = function() {
            $scope.isFooterOpened = !$scope.isFooterOpened;
            $scope.$broadcast("FOOTERHELPER_CLICKED",  null, $stateParams.skill);

            /*
             Ideally the reportHelper html element would be a direct child of the body tag. Since this isn't possible
             We do this craziness to help create that illusion
             */
            if (!$scope.isFooterOpened) {
                $scope.isFooterFullScreen = false;
                jQuery('.gl-drk12-footerhelper').removeClass("fullscreen");
                jQuery('.gl-drk12_b-helperMenu').removeClass("fullscreen");
                jQuery('.gl-drk12_b-helperMainContent').removeClass("fullscreen");
                jQuery('.gl-navbar--top').css("z-index", 10);
            }
        };

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
