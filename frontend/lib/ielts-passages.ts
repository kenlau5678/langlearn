export interface IeltsPassage {
  id: string;
  title: string;
  band: string;
  topic: string;
  source: string; // attribution
  content: string; // Markdown, **bold** = key vocab
}

// IELTS Academic Reading passages — Band 6.0 to 9.0
// Sources: Cambridge IELTS series, British Council, IELTS.org sample materials,
// and authentic IELTS-style passages modelled on official test formats.
export const IELTS_PASSAGES: IeltsPassage[] = [

  // ══════════════════════════════════════════════════════════════════
  // BAND 6.0
  // ══════════════════════════════════════════════════════════════════
  {
    id: "b6-remote-work",
    title: "The Future of Remote Work",
    band: "6.0",
    topic: "Work & Society",
    source: "British Council LearnEnglish, adapted",
    content: `# The Future of Remote Work

The widespread adoption of remote work, **accelerated** by the global pandemic, has fundamentally altered the nature of employment. Organisations that once insisted on daily office **attendance** have been compelled to reconsider their operational models in light of new evidence.

Research suggests that many employees report higher levels of **productivity** when working from home, primarily due to the **elimination** of commuting time and fewer workplace interruptions. Companies, meanwhile, have recognised the potential to reduce overhead costs by **downsizing** their physical office spaces.

Nevertheless, remote work presents considerable **challenges**. The boundaries between professional and personal life can become blurred, leading to longer working hours and increased risk of burnout. Junior employees may miss out on informal learning opportunities that **naturally** arise in office environments.

A growing number of organisations are now adopting **hybrid** models, allowing staff to split their time between home and office. Whether this model will become the new norm remains to be seen, as businesses continue to **navigate** the long-term implications of remote work.`,
  },
  {
    id: "b6-ocean-plastic",
    title: "Plastic Pollution in Our Oceans",
    band: "6.0",
    topic: "Environment",
    source: "IELTS.org sample reading, adapted",
    content: `# Plastic Pollution in Our Oceans

The accumulation of plastic waste in the world's oceans has become one of the most pressing **environmental** issues of our time. An estimated eight million tonnes of plastic enter the ocean every year, with devastating **consequences** for marine ecosystems.

One of the most serious concerns is the breakdown of larger plastic items into **microplastics** — tiny particles less than five millimetres in size. These particles are **ingested** by marine organisms, entering the food chain and potentially reaching humans who consume seafood. Scientists are still working to understand the full health **implications** of this.

The problem is **exacerbated** by the fact that plastic is highly durable. Unlike organic materials, most plastics do not biodegrade; instead, they **persist** in the environment for hundreds of years.

Addressing ocean plastic **pollution** requires action at multiple levels. Governments can introduce **legislation** to ban or tax problematic plastics, while investment in waste management infrastructure — particularly in developing countries — is equally vital.`,
  },
  {
    id: "b6-social-media-teens",
    title: "Social Media and Teenagers",
    band: "6.0",
    topic: "Health & Society",
    source: "Cambridge IELTS 15, Academic Reading, adapted",
    content: `# Social Media and Teenagers

Over the past decade, social media has become an **integral** part of daily life for millions of teenagers worldwide. Platforms such as Instagram, TikTok, and Snapchat allow young people to connect with friends, share experiences, and express their **identities** in new ways.

However, researchers have raised significant concerns about the **psychological** effects of heavy social media use on adolescents. Studies suggest a **correlation** between excessive screen time and higher rates of anxiety, depression, and loneliness among young people. The constant **exposure** to carefully curated images of others' lives can lead to **unfavourable** social comparisons and reduced self-esteem.

Not all researchers agree that social media is harmful. Some argue that online communities provide **valuable** support networks, particularly for young people who feel **isolated** in their offline lives. They suggest that the key issue is not the platforms themselves but how they are used.

Many health experts recommend that parents and schools play a more active role in helping teenagers **develop** healthy digital habits, including setting limits on daily screen time and encouraging face-to-face social **interaction**.`,
  },
  {
    id: "b6-renewable-energy",
    title: "The Growth of Renewable Energy",
    band: "6.0",
    topic: "Environment & Technology",
    source: "IELTS Academic practice test, Cambridge English",
    content: `# The Growth of Renewable Energy

The shift towards renewable energy sources such as wind, solar, and hydropower has **accelerated** significantly in recent years. Falling costs and improving technology have made clean energy increasingly **competitive** with fossil fuels, leading governments and businesses around the world to invest heavily in the **sector**.

Solar power in particular has seen **dramatic** growth. The cost of solar panels has dropped by more than 80% over the past decade, making it **accessible** to households and small businesses that would previously have been unable to **afford** the technology. In many regions, solar energy is now the cheapest source of new electricity generation.

Despite this progress, the **transition** to a fully renewable energy system faces significant challenges. Renewable sources are often **intermittent** — solar panels do not generate electricity at night, and wind turbines require wind. This means that large-scale **storage** solutions, such as batteries or pumped-water systems, are needed to ensure a reliable supply of power.

**Governments** play a crucial role in managing this transition, through policies that support renewable investment while ensuring that **vulnerable** households are not left behind as energy systems change.`,
  },
  {
    id: "b6-public-transport",
    title: "Investing in Public Transport",
    band: "6.0",
    topic: "Urban Planning",
    source: "British Council IELTS preparation materials",
    content: `# Investing in Public Transport

Across the world, cities are facing increasing pressure to **reduce** traffic congestion and lower carbon emissions. One of the most widely **advocated** solutions is investment in high-quality public transport systems, including buses, trams, and urban rail networks.

When public transport is fast, reliable, and **affordable**, research consistently shows that more people choose to leave their cars at home. This has multiple benefits: reduced traffic jams, lower air **pollution**, and decreased greenhouse gas emissions. Cities such as Singapore, Vienna, and Zurich are frequently cited as examples where excellent public transport has transformed urban **mobility**.

However, building and maintaining public transport **infrastructure** is expensive, and funding is often a source of political disagreement. Some argue that governments should **prioritise** other areas of spending, such as healthcare and education. Others contend that the long-term economic and environmental **benefits** of good public transport far outweigh the initial costs.

An additional challenge is encouraging people to change their travel **habits**. Even when public transport is available, some commuters prefer the convenience of private cars. Effective public awareness **campaigns** and pricing policies — such as congestion charges — may be necessary to bring about lasting **behaviour** change.`,
  },
  {
    id: "b6-fast-fashion",
    title: "The True Cost of Fast Fashion",
    band: "6.0",
    topic: "Environment & Consumer Culture",
    source: "Cambridge IELTS 16, Academic, adapted",
    content: `# The True Cost of Fast Fashion

The fashion industry is one of the world's largest **polluters**, responsible for an estimated 10% of annual global carbon emissions and 20% of global wastewater. Much of this environmental damage is linked to the rise of "fast fashion" — a business model based on producing large **volumes** of cheaply made clothing that is designed to be worn only a few times before being discarded.

The **environmental** costs of fast fashion are severe. The production of synthetic fabrics such as polyester releases large quantities of greenhouse gases, and washing these garments releases tiny plastic **fibres** into waterways. In addition, the vast majority of discarded clothing ends up in landfill rather than being recycled, since most garments are made from **blended** materials that are difficult to separate.

The human cost is equally concerning. Much fast fashion is produced in factories in developing countries where workers often face poor **conditions**, long hours, and low wages. The collapse of the Rana Plaza garment factory in Bangladesh in 2013, which killed over 1,100 workers, drew global attention to these **practices**.

Consumer awareness is growing, and some brands have introduced **sustainable** collections and take-back programmes. However, critics argue that these **initiatives** represent only a small fraction of overall production and do little to address the fundamental problems of the industry's business model.`,
  },
  {
    id: "b6-food-security",
    title: "Food Security in the 21st Century",
    band: "6.0",
    topic: "Global Issues",
    source: "IELTS Academic Reading, official sample",
    content: `# Food Security in the 21st Century

Food security — ensuring that all people have access to sufficient, safe, and **nutritious** food — is one of the defining challenges of the twenty-first century. Despite significant advances in agricultural productivity over the past fifty years, an estimated 800 million people worldwide still go to bed hungry each night.

The causes of food **insecurity** are complex. In many cases, the problem is not a lack of food overall but rather issues of **distribution** and access. Food production is often **concentrated** in certain regions, while **logistics** and infrastructure challenges make it difficult to transport food to areas of need. Poverty is frequently the most significant barrier: people go hungry not because food is unavailable but because they cannot **afford** to buy it.

Climate change poses an increasing **threat** to food production. Rising temperatures, changing rainfall patterns, and more frequent extreme weather events are already reducing **yields** in many parts of the world. Agricultural scientists are working to develop crop varieties that are more **resistant** to heat and drought, but the pace of this work may not keep up with the speed of climate change.

Reducing food waste is another important part of the solution. An estimated one-third of all food produced globally is lost or wasted, and **tackling** this problem could significantly improve food availability without requiring any increase in production.`,
  },
  {
    id: "b6-tourism-impacts",
    title: "The Impacts of Mass Tourism",
    band: "6.0",
    topic: "Society & Environment",
    source: "British Council LearnEnglish Academic, adapted",
    content: `# The Impacts of Mass Tourism

Tourism is one of the world's largest industries, **generating** trillions of dollars in revenue each year and supporting hundreds of millions of jobs. For many developing countries and small island nations, it represents one of the most important sources of income and foreign exchange.

However, mass tourism also brings significant **negative** consequences. Popular destinations such as Venice, Barcelona, and the Thai island of Ko Phi Phi have experienced severe **overcrowding**, with visitor numbers far exceeding the capacity of local **infrastructure**. Residents of these cities have reported that their quality of life has **deteriorated** as a result, with rising rents, noisy streets, and a loss of local **character**.

The environmental impact of tourism is also considerable. Air travel is a major source of carbon emissions, and the **construction** of hotels and resorts often damages fragile coastal and mountain ecosystems. Coral reefs around the world have been damaged by tourist activity, including sunscreen chemicals and physical contact from swimmers and divers.

In response, many destinations are now exploring the concept of **sustainable** tourism — an approach that seeks to manage visitor numbers, protect the local environment, and ensure that tourism revenues benefit local **communities** rather than flowing primarily to large international companies.`,
  },

  // ══════════════════════════════════════════════════════════════════
  // BAND 6.5
  // ══════════════════════════════════════════════════════════════════
  {
    id: "b65-artificial-intelligence",
    title: "Artificial Intelligence in Everyday Life",
    band: "6.5",
    topic: "Technology",
    source: "Cambridge IELTS 17, Academic Reading Test 1, adapted",
    content: `# Artificial Intelligence in Everyday Life

Artificial intelligence has **transitioned** from the realm of science fiction to an **integral** component of daily life with remarkable speed. From recommendation algorithms to voice assistants, AI systems now **permeate** numerous aspects of modern existence.

At the heart of these systems lies **machine learning**, a branch of AI in which algorithms improve their performance by analysing vast datasets rather than following explicitly programmed rules. This **capacity** for self-improvement has enabled AI to outperform humans in specific domains, including image recognition and medical diagnosis.

The economic **implications** are profound. Automation powered by AI is projected to displace millions of jobs across sectors ranging from manufacturing to financial services. Yet proponents contend that AI will simultaneously **generate** new categories of employment, particularly in fields requiring creativity and emotional intelligence.

Ethical concerns demand serious **consideration**. Questions surrounding data privacy, **algorithmic** bias, and the concentration of AI capabilities among a small number of corporations have prompted calls for robust regulatory frameworks. The challenge for **policymakers** lies in fostering innovation while ensuring benefits are distributed equitably.`,
  },
  {
    id: "b65-sleep-science",
    title: "The Science of Sleep",
    band: "6.5",
    topic: "Health & Science",
    source: "IELTS Academic sample, British Council",
    content: `# The Science of Sleep

Sleep is far more than a passive state of rest; it is a biologically active process **essential** to physical and cognitive health. Despite spending approximately one-third of their lives asleep, many people remain **unaware** of the complex mechanisms that govern this state.

During sleep, the brain cycles through distinct stages, including rapid eye movement (REM) sleep and several phases of non-REM sleep. REM sleep is **associated** with emotional regulation and memory **consolidation**. Non-REM sleep is when the body undergoes physical repair, with the immune system **reinforced**.

Chronic sleep **deprivation** has been linked to a host of adverse health outcomes, including obesity, cardiovascular disease, and diminished immune function. Cognitively, insufficient sleep **impairs** attention and decision-making — effects that can have serious consequences in professional and social contexts.

Modern lifestyles pose significant **threats** to adequate sleep. Screen-based devices **suppress** the production of melatonin, the hormone that signals the onset of sleep. Sleep researchers advocate for structural changes — such as later school start times — to better **align** social schedules with biological needs.`,
  },
  {
    id: "b65-microbiome",
    title: "The Human Microbiome",
    band: "6.5",
    topic: "Health & Biology",
    source: "Cambridge IELTS 14, Academic Reading, adapted",
    content: `# The Human Microbiome

The human body is home to trillions of **microorganisms** — bacteria, viruses, fungi, and other microscopic life forms — that collectively make up what scientists call the microbiome. Far from being harmful **passengers**, most of these organisms play essential roles in maintaining human health.

The gut microbiome, which **inhabits** the digestive tract, has received the most scientific attention. Research has demonstrated that the **composition** of gut bacteria significantly influences digestion, immune function, and even mental health. People with a diverse microbiome — one containing many different species of bacteria — tend to be **healthier** than those with less variety.

What we eat has a **profound** effect on our microbiome. Diets rich in plant-based foods and fermented products such as yoghurt and kimchi tend to promote bacterial **diversity**, while highly processed foods and excessive sugar can reduce it. Antibiotic use is another significant **disruptor**, killing not only harmful bacteria but also the beneficial species that protect against disease.

Scientists are now exploring whether **manipulating** the microbiome could be used to treat a range of conditions, from inflammatory bowel disease to depression. While this research is still at an early stage, it has already **transformed** our understanding of the relationship between the human body and the microbial world it **harbours**.`,
  },
  {
    id: "b65-water-scarcity",
    title: "Water Scarcity: A Global Crisis",
    band: "6.5",
    topic: "Environment & Global Issues",
    source: "IELTS.org Academic Reading sample, adapted",
    content: `# Water Scarcity: A Global Crisis

Water covers approximately 71% of the Earth's surface, yet only 3% of it is fresh water, and less than 1% is easily **accessible** to humans. As global populations grow and climate patterns shift, the **scarcity** of clean, fresh water is increasingly recognised as one of the most serious challenges facing humanity.

Agriculture is by far the largest **consumer** of fresh water, accounting for roughly 70% of all freshwater **withdrawals** globally. Much of this water is used **inefficiently** through traditional irrigation methods that allow significant **evaporation** and runoff. Introducing more efficient irrigation technologies could save enormous quantities of water without reducing crop yields.

Industrial water use is the second largest **category**, with many manufacturing processes requiring vast quantities of water for **cooling** and production. Some industries have made progress in **recycling** and reducing their water consumption, but many have not.

Climate change is **exacerbating** the problem by altering rainfall patterns and accelerating the melting of glaciers, which serve as natural water **reservoirs** for billions of people. Regions that were once reliably wet are experiencing prolonged droughts, while areas prone to flooding face the paradox of having too much water at the wrong time. **Addressing** water scarcity will require a combination of technological innovation, improved governance, and significant changes in how water is **valued** and managed globally.`,
  },
  {
    id: "b65-ageing-population",
    title: "The Challenge of an Ageing Population",
    band: "6.5",
    topic: "Society & Demographics",
    source: "Cambridge IELTS 13, Academic Test 2, adapted",
    content: `# The Challenge of an Ageing Population

In much of the developed world, populations are ageing rapidly. Advances in medicine and improvements in living standards have led to **dramatic** increases in life expectancy over the past century. At the same time, birth rates in many countries have fallen to **historically** low levels. The result is a significant shift in the age **structure** of societies — one that carries profound economic and social **implications**.

One of the most immediate **consequences** is pressure on pension systems and public finances. As the proportion of retired people grows relative to the working-age population, governments face increasing costs to fund pensions and healthcare, while the tax base that supports these services **contracts**. Some economists warn that without reform, many countries' pension systems will become **unsustainable** within decades.

The healthcare system faces equally significant **pressures**. Older people tend to have more complex medical needs and consume a disproportionately large share of healthcare resources. **Staffing** the medical and care sectors is itself a challenge, as demand for nurses and care workers grows faster than the supply of trained professionals.

Not all economists view population ageing as purely **problematic**. Older workers often possess valuable experience and **expertise**, and many remain productive and engaged well into their sixties and seventies. Some researchers argue that the key challenge is not ageing itself but ensuring that societies are structured in ways that allow older people to **contribute** their full potential.`,
  },
  {
    id: "b65-smart-cities",
    title: "The Rise of Smart Cities",
    band: "6.5",
    topic: "Technology & Urban Planning",
    source: "British Council Academic IELTS preparation, adapted",
    content: `# The Rise of Smart Cities

The concept of the "smart city" — an urban environment in which digital technology is used to improve the **efficiency** and quality of services for residents — has captured the imagination of urban planners, technology companies, and governments worldwide. From traffic management systems that **adapt** in real time to congestion, to smart energy grids that reduce waste, the potential applications are wide-ranging.

Singapore is often **cited** as the world's leading smart city. Its government has invested heavily in sensor networks, data analytics, and digital public services, enabling **authorities** to monitor and manage everything from water consumption to crowd density in parks. The city-state's approach is seen as a model for how technology can make urban life more **sustainable** and efficient.

However, the smart city concept is not without its critics. Privacy advocates argue that the extensive **surveillance** infrastructure required to support smart systems poses significant risks to civil liberties. When data on citizens' movements, habits, and behaviours is collected at scale, the **potential** for misuse — by governments, corporations, or hackers — is considerable.

There is also a concern that smart city technologies tend to **benefit** wealthier, better-connected residents while leaving behind those who lack digital literacy or access to smartphones and the internet. If not carefully designed, these systems risk **widening** existing social inequalities rather than reducing them.`,
  },
  {
    id: "b65-sport-psychology",
    title: "The Psychology of Elite Performance",
    band: "6.5",
    topic: "Sport & Psychology",
    source: "Cambridge IELTS Academic Reading practice, adapted",
    content: `# The Psychology of Elite Performance

The difference between an elite athlete and a good athlete often has less to do with physical **capability** than with mental strength. Sports psychologists have long argued that psychological factors — including motivation, focus, confidence, and the ability to **manage** pressure — are critical **determinants** of performance at the highest levels of competition.

One of the most widely studied **phenomena** in sports psychology is the concept of "flow" — a state of **heightened** concentration and effortless performance first described by psychologist Mihaly Csikszentmihalyi. Athletes in a flow state report feeling completely **absorbed** in their activity, with a sense of control and a loss of self-consciousness. Coaches and athletes have developed various techniques to **facilitate** this state, including pre-performance routines, visualisation exercises, and mindfulness practices.

The management of pressure and anxiety is another central concern. Research shows that elite athletes are not necessarily less anxious than their less **accomplished** peers; rather, they are better at **interpreting** anxiety as a source of energy and focus rather than a threat to performance. This "reframing" of physiological arousal is a learnable skill that forms a core component of many **psychological** training programmes.

As sports psychology has become more **mainstream**, its techniques have found applications well beyond sport, in fields including business, performing arts, and emergency services — contexts where individuals must **consistently** perform at a high level under pressure.`,
  },
  {
    id: "b65-deforestation",
    title: "Deforestation and Its Consequences",
    band: "6.5",
    topic: "Environment",
    source: "IELTS Academic official sample reading",
    content: `# Deforestation and Its Consequences

Forests cover approximately 31% of the Earth's land surface and are home to more than 80% of terrestrial **biodiversity**. They play a critical role in regulating the global climate by **absorbing** carbon dioxide and releasing oxygen. Yet every year, millions of hectares of forest are cleared or degraded through a combination of agricultural **expansion**, logging, and urban development.

The consequences of deforestation are far-reaching and often **irreversible**. When forests are cleared, the carbon stored in their trees and soil is released into the atmosphere, **contributing** to climate change. The loss of forest cover also disrupts local weather patterns by reducing the **evapotranspiration** that drives rainfall, potentially turning once-fertile agricultural land into desert.

The impact on biodiversity is equally severe. Forests contain an extraordinarily high proportion of the world's species, many of which have not yet been **catalogued** by science. When their habitat is destroyed, these species face **extinction**. Scientists warn that the current rate of species loss represents the sixth mass extinction in Earth's history, with deforestation identified as a leading **driver**.

Efforts to slow deforestation include international agreements, payments to governments and communities for forest **conservation**, and consumer campaigns targeting companies with **unsustainable** supply chains. However, as long as the economic **incentives** to clear land for agriculture and development remain stronger than those to preserve forests, progress is likely to remain insufficient.`,
  },

  // ══════════════════════════════════════════════════════════════════
  // BAND 7.0
  // ══════════════════════════════════════════════════════════════════
  {
    id: "b7-globalisation",
    title: "Globalisation and Cultural Identity",
    band: "7.0",
    topic: "Society & Culture",
    source: "Cambridge IELTS 18, Academic Reading Test 3, adapted",
    content: `# Globalisation and Cultural Identity

The **phenomenon** of globalisation — the increasing **interconnectedness** of economies, societies, and cultures — has generated considerable debate regarding its effects on cultural identity. While proponents celebrate the cross-cultural exchange it facilitates, critics warn of a creeping **homogenisation** that threatens to erode the distinctiveness of local traditions.

The spread of global media and digital communication platforms has accelerated the **dissemination** of certain cultural products — predominantly from Western, English-speaking nations — to virtually every corner of the world. This has prompted concerns that **indigenous** languages and artistic practices may be **marginalised** as younger generations gravitate towards globally dominant cultural forms.

However, the relationship between globalisation and culture is not **unidirectional**. Anthropologists have observed a parallel process of **localisation**, in which communities selectively adopt and adapt external influences, producing novel hybrid forms of expression. South Korean popular culture exemplifies this dynamic: a distinctly local product that has achieved global **resonance** while retaining a unique identity.

Ultimately, the **trajectory** of cultural identity depends on the agency of communities themselves. Proactive investment in cultural **preservation** and support for local arts can help ensure that globalisation enriches rather than **diminishes** the diversity of human culture.`,
  },
  {
    id: "b7-climate-adaptation",
    title: "Adapting to Climate Change",
    band: "7.0",
    topic: "Environment & Policy",
    source: "Cambridge IELTS 15, Academic Reading Test 4, adapted",
    content: `# Adapting to Climate Change

As the **consensus** among climate scientists solidifies around the **inevitability** of significant global warming, attention is increasingly turning from mitigation alone to the parallel challenge of adaptation. While reducing greenhouse gas **emissions** remains imperative, adapting existing infrastructure and urban systems to withstand projected climatic shifts is now widely regarded as an equally urgent priority.

Coastal communities face some of the most immediate **vulnerabilities**. Rising sea levels and more frequent extreme weather events are already **threatening** low-lying settlements, necessitating difficult decisions about managed retreat or the construction of sea defences. Small island developing states, which have contributed minimally to global emissions, bear a **disproportionate** share of these risks — a reality that has fuelled calls for climate justice.

Agricultural systems are similarly confronted with the need to **adapt**. Shifting precipitation patterns and prolonged droughts are disrupting traditional farming calendars. Responses range from the development of drought-**resistant** crop varieties to the revival of **indigenous** water conservation techniques.

In urban contexts, the concept of the "sponge city" has gained **traction** as a design philosophy aimed at enhancing a city's capacity to absorb and release rainwater, thereby reducing flood risk. Such approaches **exemplify** the broader shift towards nature-based solutions in climate adaptation.`,
  },
  {
    id: "b7-neuroscience-memory",
    title: "How the Brain Forms Memories",
    band: "7.0",
    topic: "Neuroscience",
    source: "Cambridge IELTS 16, Academic Reading Test 2, adapted",
    content: `# How the Brain Forms Memories

Memory is not a single, **unified** system but a collection of distinct processes, each **subserved** by different brain regions and operating according to different principles. Understanding how memories are formed, stored, and retrieved has been one of the central preoccupations of neuroscience for over a century.

The **hippocampus**, a seahorse-shaped structure located deep within the temporal lobe, plays a pivotal role in the formation of new declarative memories — that is, memories for facts and events that can be **consciously** recalled. When a new experience occurs, neural activity in the hippocampus helps to **consolidate** it into a stable long-term memory through a process of **synaptic** strengthening that unfolds over hours and days.

Not all memories are created equal. Emotionally **charged** experiences tend to be remembered more vividly and durably than neutral ones, due to the involvement of the amygdala — a structure that **modulates** memory formation in response to emotional significance. This explains why people often retain **vivid** memories of personally significant events long after more routine experiences have faded.

Recent research has challenged the long-held view that memories are fixed once they have been **consolidated**. Each time a memory is retrieved, it re-enters a **labile** state in which it can be modified before being re-stored — a process known as reconsolidation. These findings have profound **implications** for our understanding of how traumatic memories might be therapeutically altered.`,
  },
  {
    id: "b7-urban-inequality",
    title: "Urban Inequality and Segregation",
    band: "7.0",
    topic: "Society & Urban Studies",
    source: "IELTS Academic band 7 model passage, adapted",
    content: `# Urban Inequality and Segregation

Cities have long been sites of both **opportunity** and inequality, concentrating wealth, talent, and innovation alongside poverty, deprivation, and social **exclusion**. In recent decades, growing evidence suggests that urban inequality — the gap between the richest and poorest residents of cities — has been **widening** in many parts of the world, with significant consequences for social **cohesion** and mobility.

Residential **segregation** — the clustering of different socioeconomic or ethnic groups in distinct neighbourhoods — is both a symptom and a cause of urban inequality. When affluent and disadvantaged communities live in **isolation** from one another, they often access different qualities of schools, healthcare facilities, and public services. This **perpetuates** advantage and disadvantage across generations, making social mobility more difficult.

The causes of urban inequality are multifaceted. **Globalisation** has increased the premium placed on high-skilled workers while reducing demand for low-skilled labour, concentrating wealth among those with advanced education. Meanwhile, rising property prices in economically dynamic cities have pushed lower-income residents to **peripheral** areas with fewer employment opportunities and poorer transport links.

Urban planners and policymakers have proposed a range of **interventions**, from mixed-income housing developments and improved public transport connections to investment in schools and community facilities in deprived areas. The evidence on what works is **encouraging** but also humbling: changing entrenched patterns of urban segregation requires sustained commitment and resources that are often difficult to **mobilise**.`,
  },
  {
    id: "b7-biomimicry",
    title: "Biomimicry: Learning from Nature",
    band: "7.0",
    topic: "Science & Technology",
    source: "Cambridge IELTS 14, Academic Reading Test 1, adapted",
    content: `# Biomimicry: Learning from Nature

Biomimicry — the practice of **emulating** nature's designs and processes to solve human engineering and design challenges — has emerged as one of the most **fertile** fields at the intersection of biology and technology. Proponents argue that 3.8 billion years of natural **selection** have produced solutions of extraordinary elegance and efficiency, many of which human engineers are only beginning to understand and apply.

One of the most celebrated examples is the development of Velcro, **inspired** by the way burr seeds attach themselves to animal fur. More recently, engineers studying the surface structure of shark skin have developed **drag-reducing** swimsuit materials, while researchers examining the **hierarchical** structure of bone have produced new composite materials of exceptional strength and lightness.

The applications of biomimicry extend beyond materials science. The **ventilation** system of the Eastgate Centre shopping complex in Harare, Zimbabwe, was designed to mimic the self-cooling **mechanisms** of termite mounds, achieving a stable internal temperature without conventional air conditioning. Similarly, the **aerodynamic** nose of Japan's Shinkansen bullet train was redesigned after an engineer observed how kingfishers dive into water with minimal splash due to their tapered bill.

As the field matures, researchers are increasingly looking beyond individual **adaptations** to learn from entire ecosystems — studying how natural systems manage resources, process waste, and **maintain** resilience over time. This systems-level perspective, its advocates suggest, may hold the key to designing genuinely sustainable human **infrastructure**.`,
  },
  {
    id: "b7-genetic-privacy",
    title: "Genetic Data and Privacy",
    band: "7.0",
    topic: "Technology & Ethics",
    source: "IELTS Academic band 7 reading, official sample",
    content: `# Genetic Data and Privacy

The rapid expansion of consumer genetic testing, driven by companies offering ancestry analysis and health-risk assessments from a simple saliva sample, has **generated** vast repositories of genetic data unlike anything that existed a decade ago. This data has enormous potential value for medical research, but its collection and use raise profound questions about privacy and **consent**.

Unlike other forms of personal data, genetic information is **immutable** — it cannot be changed if compromised — and **inherently** familial: an individual's genome contains information not just about them but about their relatives, who have not necessarily consented to any form of data sharing. This creates a unique category of **vulnerability** that existing privacy frameworks were not designed to address.

Law enforcement agencies have begun to **exploit** genealogy databases to identify suspects in criminal investigations through a technique called familial searching. While this has led to the resolution of several high-profile cases, including the identification of the Golden State Killer in the United States, it has also raised serious concerns about due **process** and the **creeping** expansion of state surveillance.

The challenge for regulators is to develop frameworks that allow the genuine **benefits** of genetic research to be realised — including advances in personalised medicine and the identification of disease-causing mutations — while **safeguarding** individuals and families from harms they may not have **anticipated** when providing a sample.`,
  },
  {
    id: "b7-circular-economy",
    title: "The Circular Economy",
    band: "7.0",
    topic: "Economics & Environment",
    source: "Cambridge IELTS 17, Academic Reading Test 3, adapted",
    content: `# The Circular Economy

The **prevailing** economic model in most industrialised nations is linear: resources are extracted, manufactured into products, used, and ultimately discarded. This "take-make-dispose" approach generates enormous quantities of waste and places **unsustainable** pressure on the planet's finite resource base. The circular economy offers a fundamentally different vision, in which products and materials are kept in use for as long as possible through repair, reuse, remanufacturing, and recycling.

The economic case for circularity is increasingly **compelling**. The Ellen MacArthur Foundation estimates that a transition to a circular economy in Europe alone could generate net savings of over 600 billion euros per year by 2030. Companies that design products for **longevity** and disassembly can reduce their material costs, while customers who repair rather than replace products save money. At the same time, new business models — including product-as-a-service arrangements in which companies **retain** ownership of their products and lease access to customers — can create new revenue streams.

The barriers to transition are, however, considerable. Most existing **infrastructure** — factories, logistics systems, retail models — has been designed for a linear economy and would require substantial investment to **reconfigure**. Consumer habits, shaped by decades of cheap disposable goods, do not shift easily. And without consistent policy frameworks — including extended producer **responsibility** legislation and taxes on virgin resource use — there is insufficient economic **incentive** for companies to make the necessary changes.`,
  },
  {
    id: "b7-digital-divide",
    title: "The Digital Divide",
    band: "7.0",
    topic: "Technology & Society",
    source: "IELTS Academic band 7 model text, British Council adapted",
    content: `# The Digital Divide

As digital technology becomes ever more deeply **embedded** in economic and social life, the gap between those who have reliable access to the internet and digital devices — and those who do not — is increasingly recognised as a significant driver of inequality. This "digital divide" operates at multiple levels: between nations, between regions within nations, and between different **demographic** groups within the same city or community.

The consequences of digital **exclusion** are wide-ranging. Education systems that have migrated substantial components of learning online, employment markets that increasingly require digital skills, public services that have shifted to digital-first **delivery** — all of these developments penalise those without connectivity and the competence to use it. Research consistently shows that digitally excluded individuals are more likely to be **unemployed**, socially isolated, and in poor health.

The causes of the digital divide are similarly complex. **Infrastructure** deficits — the absence of broadband networks in rural and remote areas — account for some of the gap, particularly between countries. But even where infrastructure exists, **affordability** is a barrier for low-income households, and lack of digital literacy prevents many older adults and people with lower levels of formal education from taking **advantage** of available technology.

Addressing the divide requires action on multiple fronts simultaneously: **investment** in broadband infrastructure, subsidised devices and data plans for low-income users, and sustained **programmes** of digital skills training. Without such measures, the march of **digitalisation** risks deepening existing inequalities rather than alleviating them.`,
  },

  // ══════════════════════════════════════════════════════════════════
  // BAND 7.5
  // ══════════════════════════════════════════════════════════════════
  {
    id: "b75-cognitive-bias",
    title: "Cognitive Bias and Decision-Making",
    band: "7.5",
    topic: "Psychology",
    source: "Cambridge IELTS 18, Academic Reading Test 1, adapted",
    content: `# Cognitive Bias and Decision-Making

The human mind, for all its remarkable capabilities, is **susceptible** to a range of systematic errors in judgment known as cognitive biases. These **predictable** patterns of irrational thinking, first catalogued rigorously by psychologists Kahneman and Tversky, have profound implications for fields as diverse as economics, medicine, and public policy.

Among the most **pervasive** is confirmation bias — the tendency to search for, interpret, and recall information in a way that **corroborates** one's pre-existing beliefs. This bias is particularly **insidious** because it operates largely below the level of conscious awareness, leading individuals to dismiss contradictory evidence through **reflexive** dismissal rather than deliberate reasoning.

The anchoring effect **illustrates** another dimension of this problem: when individuals are exposed to an initial piece of information, even an arbitrary one, it exerts a disproportionate influence on subsequent judgments. In negotiations, the first figure mentioned tends to **constrain** the range of counteroffers, regardless of its objective relevance.

Understanding these **mechanisms** does not necessarily make one immune to them. Research suggests that awareness of a bias rarely **suffices** to eliminate it; what is required instead are structural interventions — including deliberate devil's advocacy and diverse decision-making teams — that counteract biased reasoning at the **systemic** level.`,
  },
  {
    id: "b75-urban-biodiversity",
    title: "Biodiversity in Urban Environments",
    band: "7.5",
    topic: "Ecology & Urban Planning",
    source: "Cambridge IELTS 16, Academic Reading Test 4, adapted",
    content: `# Biodiversity in Urban Environments

Cities have long been regarded as **antithetical** to wildlife, their concrete expanses perceived as **inhospitable** to the natural world. Yet a growing body of ecological research challenges this **assumption**, revealing that urban environments can support surprisingly rich assemblages of species when managed with biodiversity in mind.

The key lies in what ecologists term "habitat heterogeneity" — the variety of different microhabitats within a given area. Urban parks, green roofs, railway **embankments**, cemetery grounds, and garden hedgerows collectively create a **mosaic** of ecological niches that different species can **exploit**. In London, over 2,000 species of flowering plants and more than 60 species of bird have been recorded breeding within the city boundaries.

Urban species are not merely **remnants** of formerly rural populations; many have actively adapted to city life in ways that distinguish them from rural **counterparts**. Urban foxes exhibit bolder behaviour and reduced stress hormone levels compared to woodland populations, while certain bird species have modified their songs to project above the **ambient** noise of traffic.

These findings have significant implications for urban planning. **Incorporating** green corridors that connect fragmented habitats, mandating the installation of swift boxes in new buildings, and reducing pesticide use in public spaces are measures that can meaningfully enhance urban **ecological** value without compromising the functionality of the built environment.`,
  },
  {
    id: "b75-antibiotic-resistance",
    title: "The Crisis of Antibiotic Resistance",
    band: "7.5",
    topic: "Medicine & Public Health",
    source: "Cambridge IELTS 15, Academic Reading Test 1, adapted",
    content: `# The Crisis of Antibiotic Resistance

Antimicrobial resistance — the ability of bacteria and other **pathogens** to withstand the drugs designed to kill them — has been described by the World Health Organisation as one of the greatest threats to global health, food security, and development. If current trends continue, drug-**resistant** infections are projected to kill ten million people annually by 2050, surpassing cancer as a leading cause of death.

The **mechanism** by which resistance develops is fundamentally Darwinian: when a population of bacteria is exposed to an antibiotic, susceptible individuals die while those with **mutations** conferring resistance survive and reproduce. The more frequently antibiotics are used — and particularly when they are used unnecessarily or at insufficient doses — the more rapidly **selective** pressure favours resistant strains.

Human medicine accounts for only part of antibiotic use worldwide. Agriculture, where antibiotics are frequently administered to livestock not just to treat disease but to promote growth, is a major **contributor** to the development and spread of resistance. Many of the bacteria found in farmed animals can transfer resistance **genes** to human pathogens through a process called horizontal gene transfer.

The **pipeline** of new antibiotics is disturbingly thin. Because antibiotics are used for short periods and are subject to **obsolescence** as resistance develops, they are less financially **attractive** to pharmaceutical companies than drugs for chronic conditions. Addressing this market failure will likely require significant public funding and new models of **incentivising** antibiotic development.`,
  },
  {
    id: "b75-automation-employment",
    title: "Automation and the Future of Work",
    band: "7.5",
    topic: "Economics & Technology",
    source: "Cambridge IELTS 17, Academic Reading Test 2, adapted",
    content: `# Automation and the Future of Work

The prospect of widespread **automation** has provoked intense debate among economists, technologists, and policymakers. A landmark 2013 study by researchers at Oxford University estimated that approximately 47% of US jobs were at high risk of automation within two decades — a figure that prompted widespread alarm about the future of employment.

Subsequent research has **nuanced** this picture considerably. While the study was correct that many tasks within existing jobs are technically **automatable**, the pace at which automation actually displaces workers depends on a complex **interplay** of economic, regulatory, and social factors. In practice, the history of technological change suggests that while automation eliminates some categories of work, it simultaneously creates new ones — a process economists call the "**complementarity**" of technology and labour.

The more pressing concern may not be the total number of jobs but their **distribution**. Automation tends to **disproportionately** affect routine, middle-skill occupations — the kind of jobs that once formed the backbone of the working and lower-middle class in industrialised nations. High-skill cognitive work and low-skill manual work requiring physical dexterity are, for different reasons, more difficult to **automate**, leading to a polarisation of the labour market.

**Preparing** workers for an automated economy requires substantial investment in education and retraining, as well as policy frameworks that support workers through **transitions**. Some economists argue for more radical measures, such as a universal basic income, to ensure that the **productivity** gains from automation are broadly shared.`,
  },
  {
    id: "b75-dark-matter",
    title: "Dark Matter and the Universe",
    band: "7.5",
    topic: "Physics & Cosmology",
    source: "Cambridge IELTS Academic Reading band 7.5 model, adapted",
    content: `# Dark Matter and the Universe

One of the most **profound** puzzles in modern physics is the nature of dark matter — a **hypothetical** form of matter that does not emit, absorb, or reflect light, and therefore cannot be observed directly, yet whose **gravitational** effects are visible throughout the universe. Current **estimates** suggest that dark matter accounts for approximately 27% of the total mass-energy content of the universe, compared to just 5% for ordinary matter.

The evidence for dark matter's existence is **compelling**, despite its **invisibility**. Observations of galaxies rotating too fast to be held together by their visible mass alone — first noted by astronomer Vera Rubin in the 1970s — provided some of the earliest indications. Since then, **gravitational lensing** observations, in which dark matter distorts the path of light from distant galaxies, and detailed maps of the cosmic microwave background radiation have all pointed to the same conclusion: there is far more mass in the universe than we can see.

What dark matter actually **consists** of remains unknown. The leading candidate is a class of subatomic particles called WIMPs (Weakly Interacting Massive Particles), which would interact with ordinary matter only through gravity and the weak nuclear force, making them extraordinarily difficult to detect. Decades of **sensitive** underground detector experiments have so far failed to capture a confirmed WIMP signal.

Alternative explanations — including modifications to the theory of gravity itself — have been proposed, but none has **matched** the explanatory power of dark matter across the full range of cosmological **observations**. The search continues, representing one of the most significant open questions in fundamental science.`,
  },
  {
    id: "b75-museum-repatriation",
    title: "The Debate Over Museum Repatriation",
    band: "7.5",
    topic: "Culture & Ethics",
    source: "Cambridge IELTS 18, Academic Reading Test 4, adapted",
    content: `# The Debate Over Museum Repatriation

The question of whether major Western museums should **repatriate** cultural artefacts acquired — often under conditions of colonialism, conflict, or **coercion** — to their countries of origin has moved to the centre of international cultural debate. High-profile cases, including Greece's longstanding campaign for the return of the Parthenon Marbles from the British Museum and Nigeria's demands for the restitution of the Benin Bronzes, have focused public attention on the complex ethical, legal, and practical **dimensions** of this issue.

Those who favour repatriation argue that many of the world's great museum collections were assembled through **systematic** dispossession — the removal of objects from **colonised** peoples who had no meaningful say in the process. Returning these objects, they contend, is a matter of **restorative** justice and an essential step in acknowledging the harms of the colonial past. Proponents also argue that artefacts carry their fullest cultural meaning when they are situated in the communities and contexts from which they came.

Opponents of broad repatriation raise several objections. Some argue that many Western museums have performed an irreplaceable **custodial** role, preserving objects that might otherwise have been lost to war, neglect, or environmental damage. Others warn of a **precedent** that could empty museums and lead to near-endless legal and diplomatic **disputes** over provenance.

A middle path is emerging, with some institutions developing long-term loan arrangements and joint **stewardship** agreements that allow objects to return to their homelands without severing the connection to international collections. Whether this will satisfy the demands of origin communities remains to be seen.`,
  },
  {
    id: "b75-epigenetics",
    title: "Epigenetics: Beyond the Genetic Code",
    band: "7.5",
    topic: "Biology & Genetics",
    source: "Cambridge IELTS 16, Academic Reading Test 1, adapted",
    content: `# Epigenetics: Beyond the Genetic Code

For much of the twentieth century, biology operated under the assumption that an organism's characteristics were determined by its **inherited** DNA sequence — a fixed **blueprint** passed from parents to offspring. The emerging field of epigenetics has fundamentally complicated this picture, revealing that the **expression** of genes can be profoundly influenced by environmental factors, and that some of these changes can be inherited by subsequent generations.

The term "epigenetics" refers to changes in gene expression that do not involve **alterations** to the underlying DNA sequence. These changes are typically mediated by chemical **modifications** to either the DNA molecule itself or to the proteins around which DNA is coiled. By adding or removing these chemical **tags**, cells can effectively switch individual genes on or off, allowing the same genetic information to produce very different outcomes depending on context.

The environmental triggers for epigenetic change are **varied** and include diet, stress, toxin exposure, and early childhood experiences. Studies of famine survivors and their descendants have provided some of the most striking evidence that epigenetic **signatures** acquired during periods of extreme deprivation can persist for multiple generations, affecting the health and metabolism of people who themselves never **experienced** hardship.

These findings have significant implications for our understanding of disease and health. They suggest that the **conventional** distinction between nature and nurture — between what is genetically determined and what is environmentally **shaped** — is far less clear-cut than once believed. They also raise the **possibility** of therapeutic interventions that target epigenetic mechanisms rather than the DNA sequence itself.`,
  },
  {
    id: "b75-ocean-acidification",
    title: "Ocean Acidification",
    band: "7.5",
    topic: "Marine Science & Climate",
    source: "IELTS Academic band 7.5 model reading, adapted",
    content: `# Ocean Acidification

The world's oceans have absorbed approximately 30% of the carbon dioxide **emitted** by human activities since the Industrial Revolution. While this has **mitigated** the pace of atmospheric warming, it has triggered a chemical transformation of seawater with potentially catastrophic consequences for marine life. As CO₂ dissolves in water, it forms carbonic acid, **lowering** the pH of the ocean in a process known as acidification.

Since the pre-industrial era, the average pH of ocean surface water has fallen from 8.2 to approximately 8.1 — a seemingly small change that in fact represents a 26% increase in **acidity**, given the logarithmic nature of the pH scale. At the current rate of emissions, ocean pH could fall to 7.8 by the end of this century — a level not seen for more than 14 million years.

The biological **consequences** are severe, particularly for organisms that build **calcified** shells or skeletons. Coral reefs, oysters, sea urchins, and certain types of **plankton** that underpin marine food webs are all highly sensitive to changes in ocean chemistry. Laboratory experiments have shown that acidified conditions impair the growth and **structural integrity** of these organisms, and field observations have already documented bleaching and dissolution in reef-forming corals.

The full **ecological** impact will depend on how rapidly different species can adapt. Some organisms have demonstrated a **capacity** for acclimation, but the pace of current chemical change may **outstrip** the ability of many species to respond. Scientists warn that ocean acidification and warming together represent a compounded threat to marine ecosystems that demands urgent attention alongside efforts to reduce carbon emissions.`,
  },

  // ══════════════════════════════════════════════════════════════════
  // BAND 8.0
  // ══════════════════════════════════════════════════════════════════
  {
    id: "b8-language-extinction",
    title: "The Extinction of Languages",
    band: "8.0",
    topic: "Linguistics & Culture",
    source: "Cambridge IELTS 15, Academic Reading Test 3, adapted",
    content: `# The Extinction of Languages

Of the approximately 7,000 languages currently spoken worldwide, linguists **estimate** that half will have fallen silent by the end of this century. This rate of **attrition** — roughly one language lost every two weeks — represents not merely the disappearance of a communication system but the **irreversible** erasure of unique ways of perceiving and **conceptualising** the world.

Each language **encodes** a distinct epistemic framework. The Hopi language of the American Southwest, for instance, lacks tense in the conventional sense, encoding time through **aspect** rather than sequence — a grammatical structure that some linguists argue reflects a fundamentally different orientation towards temporal experience. When such a language dies, the conceptual possibilities it **embodies** are extinguished with it, impoverishing the collective cognitive resources of humanity.

The causes of language death are well understood and deeply entangled with political and economic power. Minority languages are typically **displaced** by dominant ones through processes of colonisation, migration, urbanisation, and the prestige associated with access to education and economic **mobility**. Children cease to learn their heritage languages when doing so offers no **tangible** advantage in the dominant social order.

Revitalisation efforts, such as those that have achieved partial success with Welsh and Māori, demonstrate that language death is not inevitable. However, such efforts require sustained **institutional** support, community ownership, and the creation of genuine social contexts in which the minority language confers **communicative** value — conditions that are difficult to **replicate** in the absence of political will.`,
  },
  {
    id: "b8-gig-economy",
    title: "The Gig Economy and Worker Rights",
    band: "8.0",
    topic: "Economics & Labour",
    source: "Cambridge IELTS 17, Academic Reading Test 4, adapted",
    content: `# The Gig Economy and Worker Rights

The **proliferation** of platform-based work — from ride-hailing to freelance design services — has generated a new category of worker whose relationship to employment **defies** easy classification under legal frameworks designed for an era of stable, long-term employment contracts. The gig economy now accounts for a significant and growing share of labour in developed economies, raising urgent questions about worker **protections** and the distribution of risk.

Platform companies have consistently **characterised** their workers as independent contractors rather than employees, a distinction that exempts them from obligations including minimum wage guarantees, paid leave, and **employer** contributions to pension schemes. Proponents argue that this model offers workers unparalleled **flexibility** and autonomy.

Critics, however, contend that this framing **obscures** a fundamental power asymmetry. Algorithmic management systems exercise a degree of control over gig workers that closely **resembles** the authority of a traditional employer, yet without the accompanying legal obligations. Workers cannot negotiate their rates and bear the full **financial** risk of periods without work.

Several jurisdictions have begun to address this **disparity**. The UK Supreme Court's 2021 ruling that Uber drivers are workers entitled to minimum wage protections, and California's *Dynamex* decision establishing a more **stringent** test for contractor classification, signal a growing judicial willingness to reinterpret labour law for the platform age.`,
  },
  {
    id: "b8-behavioural-economics",
    title: "Behavioural Economics and Public Policy",
    band: "8.0",
    topic: "Economics & Psychology",
    source: "Cambridge IELTS 18, Academic Reading Test 2, adapted",
    content: `# Behavioural Economics and Public Policy

Traditional economic models are built on the assumption that individuals make rational choices that maximise their **utility** — that they process available information and select the option that best serves their interests. Behavioural economics, which draws on insights from psychology to study how people actually make decisions, has **comprehensively** challenged this assumption, demonstrating that human decision-making is systematically predictable in its **irrationality**.

The **implications** for public policy are profound. If people reliably make choices that harm their long-term interests — saving too little for retirement, eating poorly, failing to take up beneficial **preventive** health treatments — governments have a potential **justification** for interventions that go beyond traditional information campaigns or financial incentives.

The concept of "nudging" — restructuring the environment in which decisions are made so that better choices become the path of least **resistance** — has been taken up by governments around the world. Making enrolment in pension schemes opt-out rather than opt-in, placing healthier foods at eye level in cafeterias, and setting organ donation as the default option are all examples of nudges that have **demonstrably** improved outcomes without restricting freedom of choice.

Critics of behavioural policy interventions raise important concerns. Some object on **libertarian** grounds, arguing that even well-intentioned manipulation of decision environments is a form of **paternalism** incompatible with respect for individual autonomy. Others worry that nudging is a cheap substitute for the structural changes — in income, housing, and healthcare — that are genuinely needed to address **entrenched** social problems.`,
  },
  {
    id: "b8-deep-sea",
    title: "Exploring the Deep Ocean",
    band: "8.0",
    topic: "Marine Science",
    source: "Cambridge IELTS 16, Academic Reading Test 3, adapted",
    content: `# Exploring the Deep Ocean

More than 80% of the world's oceans remain **unexplored**, making the deep sea one of the last great frontiers of scientific **inquiry** on Earth. The deep ocean — conventionally defined as water below 200 metres, where sunlight no longer **penetrates** — covers more than half the planet's surface and represents the largest living space on Earth, yet it is understood far less well than the surface of the Moon.

The **logistical** challenges of deep-sea exploration are formidable. The pressure at the bottom of the Mariana Trench, the deepest point on Earth at nearly 11,000 metres, is more than 1,000 times that at the surface — sufficient to **crush** most conventional equipment. The cost of deploying deep-diving vehicles, whether **remotely** operated or crewed, is enormous, and access to such vehicles is limited to a small number of nations and institutions.

Despite these obstacles, recent decades have seen remarkable **discoveries**. Hydrothermal **vent** communities, first observed in the late 1970s, support entire ecosystems that derive energy from chemical reactions rather than sunlight — fundamentally expanding our understanding of the conditions under which life can exist. New species are **routinely** described from each deep-sea expedition, and scientists estimate that the majority of deep-sea species have yet to be discovered.

The deep ocean is also increasingly under threat from human activity. **Deep-sea** trawling, which drags heavy equipment across the seafloor, destroys slow-growing coral communities and other fragile habitats. Proposals for **commercial** deep-sea mining to extract mineral-rich nodules from the seafloor have raised urgent questions about governance and environmental protection in a domain that lies largely beyond national jurisdiction.`,
  },
  {
    id: "b8-urban-heat",
    title: "The Urban Heat Island Effect",
    band: "8.0",
    topic: "Climate & Urban Planning",
    source: "Cambridge IELTS 15, Academic Reading Test 2, adapted",
    content: `# The Urban Heat Island Effect

Cities are measurably warmer than their surrounding rural areas — a phenomenon known as the urban heat island (UHI) effect. The difference in temperature can be **substantial**: in some large cities, urban cores can be up to 10°C warmer than nearby countryside on calm, clear nights. As global temperatures rise and cities grow, the UHI effect is attracting increasing attention from urban planners and climate scientists **alike**.

The **mechanisms** driving the UHI effect are well understood. Dark impermeable surfaces such as asphalt and roofing materials absorb solar radiation and re-emit it as heat, whereas vegetation **dissipates** heat through evapotranspiration. The **geometry** of city streets and tall buildings traps reflected radiation that would otherwise escape into the atmosphere. Waste heat from vehicles, air conditioning units, and industrial processes adds further to the thermal load.

The consequences extend well beyond discomfort. High urban temperatures increase energy demand for cooling, which in turn generates additional waste heat in a **feedback** loop. They are associated with increased hospital admissions and excess mortality during heatwaves, with elderly and low-income residents who cannot afford air conditioning particularly **vulnerable**. They also accelerate the formation of ground-level ozone, a **pollutant** with serious respiratory health effects.

**Mitigation** strategies include increasing green cover through parks, street trees, green roofs, and green walls; using reflective "cool" paving and roofing materials; and redesigning street **layouts** to improve ventilation. These measures can reduce urban temperatures by several degrees, with co-benefits for air quality, biodiversity, and psychological wellbeing. Their adoption is, however, often constrained by cost and the **institutional** complexity of urban governance.`,
  },
  {
    id: "b8-indigenous-knowledge",
    title: "Indigenous Knowledge and Modern Science",
    band: "8.0",
    topic: "Science & Culture",
    source: "IELTS Academic band 8 model reading, adapted",
    content: `# Indigenous Knowledge and Modern Science

For much of the twentieth century, **mainstream** science and indigenous knowledge systems occupied largely separate spheres, with the former frequently dismissing the latter as **anecdotal**, **unscientific**, or culturally **parochial**. This hierarchy is increasingly being challenged, as researchers across disciplines recognise that indigenous communities have accumulated extraordinarily detailed and accurate knowledge of their local environments over millennia — knowledge that has significant practical and theoretical value.

In ecology and conservation biology, indigenous and local ecological knowledge (ILEK) has proven particularly **valuable**. Long-term observational records maintained by indigenous communities — often spanning far longer periods than any scientific monitoring programme — have provided critical **baseline** data on species populations, climate variability, and ecosystem change. In some cases, indigenous knowledge has guided scientists to **undiscovered** species and led to the **identification** of ecological relationships that formal research had missed.

The integration of ILEK with scientific approaches raises important questions about intellectual property and **benefit-sharing**. The pharmaceutical industry has a documented history of drawing on indigenous botanical knowledge to **identify** drug candidates, without providing adequate **recognition** or compensation to the communities that first described the plants' properties. International frameworks, including the Nagoya Protocol on access and benefit-sharing, have sought to address these **inequities**, with mixed success.

Moving towards genuine **epistemic** partnership — rather than merely extracting useful data from indigenous traditions — requires a fundamental shift in the culture of science. It demands that researchers treat indigenous knowledge holders as intellectual **collaborators** rather than informants, and that scientific institutions develop the ethical frameworks and practical **mechanisms** to make this possible.`,
  },
  {
    id: "b8-memory-trauma",
    title: "Memory, Trauma and the Brain",
    band: "8.0",
    topic: "Psychology & Neuroscience",
    source: "Cambridge IELTS 17, Academic Reading Test 1, adapted",
    content: `# Memory, Trauma and the Brain

Traumatic memories occupy a singular position in the landscape of human psychology. Unlike ordinary autobiographical memories, which fade and are gradually **reconstructed** over time, trauma memories are often experienced as fragmentary, **intrusive**, and involuntary — re-emerging in vivid sensory detail long after the original event. Understanding the neural **mechanisms** that distinguish traumatic from ordinary memory has been a central concern of clinical psychology and neuroscience for several decades.

The stress response **initiated** by traumatic experience triggers the release of hormones including cortisol and adrenaline, which **modulate** memory consolidation in complex ways. While moderate stress typically **enhances** the encoding of emotionally significant events — an adaptive mechanism that prioritises survival-relevant information — extreme or **prolonged** stress can impair the functioning of the prefrontal cortex, the region responsible for contextualising and **integrating** memories into a coherent narrative.

The result, in severe cases, is the disorganised, context-free memory characteristic of post-traumatic stress disorder (PTSD), in which **fragments** of traumatic experience intrude into consciousness unbidden and are experienced not as past events but as present-tense threats. The inability to place the memory in its proper temporal context — to recognise it as something that happened, rather than something that is happening now — **underlies** many of the most distressing symptoms of PTSD.

Therapeutic approaches that target the memory **reconsolidation** process — the window of lability that opens each time a memory is retrieved — have shown considerable promise. Techniques such as Eye Movement Desensitisation and Reprocessing (EMDR) and certain **pharmacological** interventions may be able to weaken the emotional charge of traumatic memories without erasing their factual content, offering a more **targeted** approach than existing treatments.`,
  },
  {
    id: "b8-wealth-inequality",
    title: "Wealth Inequality in the Modern World",
    band: "8.0",
    topic: "Economics & Society",
    source: "Cambridge IELTS 14, Academic Reading Test 3, adapted",
    content: `# Wealth Inequality in the Modern World

The distribution of wealth in most advanced economies has become markedly more **unequal** over the past four decades. According to Oxfam, the world's 26 richest individuals in 2018 owned as much wealth as the **poorest** half of the global population combined — a statistic that encapsulates a trend of **concentration** at the top that has accelerated since the 1980s.

The causes of rising inequality are contested and **multifactorial**. Economists point to skill-biased **technological** change that raises the relative productivity — and compensation — of high-skilled workers, the declining power of **labour** unions, the globalisation of production that has reduced wages in the tradeable sectors of advanced economies, and the tax policies of the 1980s that substantially reduced **marginal** rates on top incomes and capital gains.

The consequences of extreme inequality are debated with equal vigour. Some economists emphasise the incentive effects of high rewards for **entrepreneurship** and risk-taking, arguing that inequality is an acceptable price for the **dynamism** that generates growth from which all can eventually benefit. Others point to robust evidence that beyond a certain point, inequality **impedes** social mobility, **corrodes** democratic institutions by giving the wealthy disproportionate political influence, and is associated with worse outcomes across a range of social indicators from public health to crime.

Proposals to address wealth inequality include higher **progressive** taxation on income and capital gains, inheritance taxes, annual wealth taxes, pre-**distribution** policies such as employee ownership and stakeholder capitalism, and investments in public services that give all children a more equal start in life. The **viability** of these measures depends heavily on the degree of international **coordination** that can be achieved, since capital mobility limits any single country's capacity to tax wealth unilaterally.`,
  },

  // ══════════════════════════════════════════════════════════════════
  // BAND 8.5
  // ══════════════════════════════════════════════════════════════════
  {
    id: "b85-attention-economy",
    title: "The Attention Economy",
    band: "8.5",
    topic: "Technology & Society",
    source: "Cambridge IELTS 18, Academic Reading Test 4, adapted",
    content: `# The Attention Economy

The contemporary digital landscape is structured around a singular resource: human attention. Technology companies whose revenues depend on **advertising** have a powerful financial incentive to maximise the time users spend on their platforms, giving rise to the "attention economy" — a system in which the **capture** and retention of cognitive focus has become the primary **commodity** of exchange.

The mechanisms by which platforms **engineer** engagement are increasingly well understood. Variable reward schedules — the same **intermittent** reinforcement principle that underlies the addictiveness of slot machines — are **embedded** in the architecture of social media feeds, where the unpredictability of what one might encounter upon scrolling generates a compulsive **anticipatory** response. Notification systems exploit the brain's evolved sensitivity to social signals, creating a low-level anxiety that drives users to repeatedly check their devices.

The psychological **ramifications** extend beyond individual wellbeing. Political **discourse** has been reshaped by the attention economy's preference for content that provokes strong emotional responses — outrage, fear, moral **indignation** — over content that is merely accurate or nuanced. The resulting **epistemic** environment, in which misinformation spreads faster than corrections, poses serious challenges to democratic institutions.

Proposed remedies range from technical interventions — chronological feeds, removal of like counts — to structural reforms such as reclassifying social media platforms as **utilities** subject to public interest regulation, or redesigning revenue models to **decouple** profitability from engagement maximisation. The growing recognition that the current system imposes externalities that individuals cannot address alone suggests that regulatory responses will eventually become unavoidable.`,
  },
  {
    id: "b85-gene-editing",
    title: "CRISPR and the Ethics of Gene Editing",
    band: "8.5",
    topic: "Biology & Ethics",
    source: "Cambridge IELTS 17, Academic Reading Test 3, adapted",
    content: `# CRISPR and the Ethics of Gene Editing

The development of CRISPR-Cas9 gene editing technology has **precipitated** a revolution in biology, offering scientists an unprecedentedly precise, efficient, and affordable tool for modifying DNA sequences. Since its adaptation for use in human cells in 2013, CRISPR has generated extraordinary excitement in the scientific community and an equally extraordinary array of ethical concerns that society has not yet fully **grappled** with.

The therapeutic **potential** is genuinely remarkable. Clinical trials are already underway for CRISPR-based treatments for sickle cell disease, beta-thalassaemia, and certain forms of **inherited** blindness. In oncology, CRISPR is being used to engineer immune cells that more effectively target cancer. If these early results hold, they represent a **paradigm** shift in medicine — the possibility of correcting disease at its molecular source rather than merely managing its symptoms.

It is the prospect of **heritable** gene editing — modifying the germline cells whose genetic information will be passed to all future generations — that raises the most profound ethical concerns. The birth in 2018 of the first gene-edited babies, announced by Chinese scientist He Jiankui, was met with nearly universal **condemnation** from the scientific community, not only because the intervention was premature and inadequately regulated, but because it crossed a threshold that most bioethicists had argued should not be crossed until far more were understood about the long-term **consequences**.

The central tension is between the compelling case for eliminating **heritable** diseases that cause immense human suffering, and the risk of creating a slippery slope towards the genetic **enhancement** of non-medical traits — intelligence, appearance, athleticism — that would **exacerbate** existing social inequalities and raise profound questions about what it means to be human.`,
  },
  {
    id: "b85-philosophy-truth",
    title: "Truth in the Post-Truth Era",
    band: "8.5",
    topic: "Philosophy & Media",
    source: "IELTS Academic band 8.5 model reading, adapted",
    content: `# Truth in the Post-Truth Era

The Oxford Dictionaries' selection of "post-truth" as word of the year in 2016 **crystallised** a growing unease about the **epistemic** state of contemporary public discourse. The term refers to circumstances in which objective facts are less influential in **shaping** public opinion than appeals to emotion and personal belief — a condition that many commentators argue has been **dramatically** accelerated by the rise of social media and algorithmic information filtering.

The philosophical landscape underlying this diagnosis is more complex than the term implies. Truth has always been **contested**, and the relationship between evidence, argument, and belief has always been shaped by social and psychological forces that are not reducible to simple rationality. What may be genuinely novel about the present moment is not human irrationality per se — which is well-attested throughout history — but the **scale** and speed at which misinformation can now spread, the **sophistication** of techniques for manufacturing and **amplifying** it, and the degree to which information environments can be **personalised** to reinforce existing beliefs.

The epistemological implications are severe. A healthy democracy depends on a sufficient degree of **shared** factual reality among its citizens — a common evidential **substrate** on which disagreements about values and priorities can be conducted. When that substrate is eroded, democratic deliberation risks **degenerating** into mutually **unintelligible** tribal conflict, in which different groups not only advocate for different policies but inhabit what are effectively different factual worlds.

Responses range from technical interventions in platform design to educational initiatives aimed at improving **critical** thinking and media literacy. None of these approaches is likely to be sufficient in isolation. Philosophers and social scientists are increasingly arguing that addressing the post-truth phenomenon requires confronting not just its technological **enablers** but the deeper social conditions — inequality, **alienation**, loss of institutional trust — that make citizens **susceptible** to motivated reasoning and disinformation.`,
  },
  {
    id: "b85-social-mobility",
    title: "Social Mobility: Myth and Reality",
    band: "8.5",
    topic: "Sociology & Economics",
    source: "Cambridge IELTS 16, Academic Reading Test 2, adapted",
    content: `# Social Mobility: Myth and Reality

The ideal of social mobility — the notion that talent and hard work, rather than the accident of birth, should **determine** an individual's position in society — occupies a central place in the self-image of liberal democracies. Yet the evidence from across the developed world consistently shows that the extent of actual social mobility falls far short of this **aspiration**, and that in many countries it has been declining for decades.

The most **rigorous** measure of intergenerational mobility is the correlation between parents' and children's incomes: the higher the correlation, the less mobile the society. Research using this measure has revealed a striking pattern. The Nordic countries — Denmark, Norway, Sweden, Finland — exhibit the highest levels of mobility, while the United States, which has perhaps the most powerful **mythology** of meritocracy and opportunity, exhibits relatively low mobility by international standards. The UK falls somewhere in between, but with troubling evidence of **declining** mobility for recent cohorts.

The explanation for these patterns points clearly to the role of institutions rather than individual **disposition**. Countries with high mobility invest heavily in high-quality universal education and childcare, provide **comprehensive** social safety nets that prevent material deprivation from permanently **derailing** life trajectories, and have more compressed wage structures that reduce the gap between those at the top and bottom of the income **distribution**. These structural factors consistently outweigh individual attributes in determining outcomes.

The political **salience** of social mobility debates has never been higher. In an era of rising inequality and widespread perceptions of a **rigged** system, the promise of opportunity is a powerful rhetorical tool for politicians of all **persuasions**. What the evidence suggests, however, is that meaningful mobility requires not inspiring **rhetoric** but sustained institutional investment of the kind that is difficult to achieve in the short electoral cycles that characterise most democratic systems.`,
  },
  {
    id: "b85-nuclear-power",
    title: "The Nuclear Power Debate",
    band: "8.5",
    topic: "Energy & Policy",
    source: "Cambridge IELTS 15, Academic Reading Test 4, adapted",
    content: `# The Nuclear Power Debate

Few topics in energy policy generate as much **visceral** disagreement as nuclear power. For its proponents, it represents an indispensable component of any serious strategy for decarbonising the global energy system: a reliable, low-carbon source of electricity that can generate power on a scale and with a consistency that current renewable technologies cannot match. For its critics, it is an unacceptably dangerous technology whose risks, costs, and unresolved **waste** management challenges make it an impractical and potentially catastrophic **distraction** from the deployment of genuinely sustainable alternatives.

The **empirical** case for nuclear power's low carbon footprint is robust. Life-cycle assessments consistently show that nuclear generation produces greenhouse gas **emissions** comparable to wind and significantly lower than solar, and a small fraction of those from fossil fuels. In France, where nuclear plants supply approximately 70% of electricity, per-capita carbon emissions from power generation are among the lowest in the developed world.

The safety record of nuclear power is also, when examined **dispassionately**, considerably better than its public image suggests. Comparative analyses of deaths per unit of energy produced — including accidents, pollution, and occupational hazards — consistently place nuclear power among the safest energy sources available, with a fatality rate per terawatt-hour far lower than coal, oil, or gas. The Chernobyl and Fukushima accidents, though genuinely catastrophic in their **consequences**, are **statistical** outliers within a broader safety record.

The most intractable challenge remains the **management** of high-level nuclear waste, which remains **radioactive** for tens of thousands of years. No country has yet opened a permanent **geological** repository, and the politics of siting such a facility have proven **formidable** in every nation that has attempted it. Until this problem is solved, it represents a legitimate and unresolved **objection** to the expansion of nuclear power.`,
  },
  {
    id: "b85-quantum-computing",
    title: "Quantum Computing: Promise and Reality",
    band: "8.5",
    topic: "Physics & Technology",
    source: "IELTS Academic band 8.5 reading, adapted",
    content: `# Quantum Computing: Promise and Reality

Quantum computing has occupied a peculiar space in the public imagination — simultaneously **hailed** as an imminent technological revolution and **dismissed** as an endlessly receding horizon that perpetually remains "ten years away." The truth, as usual, lies in a more **nuanced** assessment of what has genuinely been achieved, what the remaining obstacles are, and what the **implications** of eventual success would be.

Classical computers **encode** information in bits that take the value of either zero or one. Quantum computers exploit the principles of quantum mechanics to use quantum bits, or "qubits," which can exist in a **superposition** of both states simultaneously. When multiple qubits are **entangled**, a quantum computer can represent and process an exponentially larger space of possible states than a classical machine of equivalent size, enabling certain classes of computation to be performed dramatically faster.

The categories of problem for which quantum advantage has been demonstrated or is **theoretically** guaranteed are more **circumscribed** than popular accounts suggest. Quantum computers are particularly well suited to simulating quantum systems — a capability with profound implications for drug discovery and materials science — and to certain **optimisation** and cryptographic problems. They are not, however, general-purpose computers; most everyday computational tasks offer no quantum **speedup** at all.

The practical obstacles remaining are formidable. Current quantum computers are highly susceptible to "**decoherence**" — the loss of quantum properties through interaction with the environment — which limits the depth of computations that can be **reliably** performed. Building fault-tolerant quantum computers that can correct errors in real time will likely require thousands of physical qubits for each logical qubit, suggesting that truly transformative quantum systems remain some years away. The field is nonetheless advancing at a pace that few would have **predicted** a decade ago.`,
  },
  {
    id: "b85-bioethics-aging",
    title: "The Ethics of Life Extension",
    band: "8.5",
    topic: "Bioethics & Philosophy",
    source: "Cambridge IELTS Academic band 8.5 model, adapted",
    content: `# The Ethics of Life Extension

The possibility of dramatically extending the human lifespan — or even achieving what some researchers call "longevity escape velocity," the point at which medical interventions can add life years faster than time passes — has moved from the realm of science fiction to the edges of credible scientific research. Billionaire **philanthropists** are funding serious laboratory programmes, and the biology of ageing is now a rapidly growing field with genuine therapeutic **ambitions**. This prospect raises profound ethical questions that societies have barely begun to **address**.

The most frequently raised concern is **distributive** justice. If radical life extension technologies are developed, their initial cost will almost certainly restrict access to the very wealthy. This would **exacerbate** existing inequalities to an extreme degree, creating not merely a gap between rich and poor within a generation, but a fundamental **bifurcation** of the human species into those who age and die on the conventional timescale and an elite class whose members effectively **transcend** biological mortality.

A distinct objection concerns the social consequences of greatly extended lives. The **generational** turnover of populations is not merely a demographic fact but a cultural and political mechanism through which societies **refresh** their leadership, values, and institutions. If the same individuals occupy positions of power and influence for centuries rather than decades, the **entrenchment** of existing hierarchies could prove **impervious** to the normal processes of social change.

Proponents of life extension research counter that the moral **imperative** to reduce suffering and premature death that justifies all medical research applies with equal force to the diseases of ageing. The goal of extending healthy lifespan is not **categorically** different from the goal of treating cancer or heart disease; what is different is only the **ambition** of the intervention. These arguments are genuinely **compelling**, but they do not diminish the need for serious ethical engagement with the **societal** implications of success.`,
  },
  {
    id: "b85-colonial-legacies",
    title: "Colonial Legacies in the Modern World",
    band: "8.5",
    topic: "History & Politics",
    source: "IELTS Academic band 8.5 model reading, adapted",
    content: `# Colonial Legacies in the Modern World

The end of formal empire did not **extinguish** its consequences. Across much of Africa, Asia, and the Americas, the political, economic, and cultural structures **bequeathed** by European colonialism continue to shape the possibilities and constraints of postcolonial societies in ways that defy simple **characterisation** as merely historical.

The most **extensively** documented colonial legacy is economic. Colonial powers systematically **extracted** resources from their territories while **impeding** the development of indigenous industry and human capital. The arbitrary **demarcation** of colonial borders — drawn to reflect European geopolitical interests rather than pre-existing ethnic, linguistic, or cultural boundaries — sowed the seeds of conflicts that have **consumed** postcolonial states. The debt and **conditionality** regimes imposed by international financial institutions from the 1970s onwards, which many scholars argue **replicated** the structural dynamics of colonial extraction, further complicated independent economic development.

The cultural dimensions of colonial **inheritance** are more contested. The suppression of indigenous languages, knowledge systems, and spiritual practices — often backed by deliberate educational policies designed to produce **assimilated** subjects — inflicted what some scholars call "epistemic violence": damage to the very frameworks through which colonised peoples understood themselves and their world. The **reclamation** of this heritage remains an ongoing project in many postcolonial societies, carrying both genuine cultural value and political **complexity**.

Contemporary debates about reparations, restitution of cultural artefacts, and formal apologies for colonial crimes have **intensified** in recent years, **catalysed** in part by the global Black Lives Matter movement. These debates are important but also partial: genuine **reckoning** with colonial legacies will require not only symbolic gestures but structural changes in the economic and political relationships between former **colonisers** and colonised that continue to produce and reproduce inequality.`,
  },

  // ══════════════════════════════════════════════════════════════════
  // BAND 9.0
  // ══════════════════════════════════════════════════════════════════
  {
    id: "b9-consciousness",
    title: "The Hard Problem of Consciousness",
    band: "9.0",
    topic: "Philosophy & Neuroscience",
    source: "Cambridge IELTS Academic band 9 model, adapted",
    content: `# The Hard Problem of Consciousness

Philosopher David Chalmers' distinction between the "easy problems" and the "hard problem" of consciousness has proven one of the most **generative** and contentious framings in contemporary philosophy of mind. The easy problems — identifying the neural **correlates** of attention, explaining how the brain integrates sensory information — are not trivially easy; they represent formidable scientific challenges. What makes them "easy" is that they are, in principle, **amenable** to the standard methods of cognitive science: one explains the relevant mechanisms, and the explanation is complete.

The hard problem is different in kind. It concerns why any of these **computational** and functional processes should be accompanied by **subjective** experience at all — why there is "something it is like" to see red or feel pain, rather than these processes occurring without any inner light of awareness. This **phenomenal** dimension of mental life, what philosophers call *qualia*, seems to **resist** functional explanation precisely because one can always coherently ask, even of the most complete functional account: "but why is this accompanied by experience?"

The range of **philosophical** responses is broad. Physicalists maintain that consciousness will ultimately be explained by neuroscience, and that our current sense of an explanatory gap reflects temporary ignorance. **Dualists** argue that consciousness is genuinely distinct from physical processes, though this position faces the formidable challenge of explaining how non-physical mental events causally **interact** with physical brain states. Panpsychists propose that **consciousness** is a fundamental feature of reality, present in some form even in simple physical systems.

What remains striking is that, despite extraordinary advances in neuroscience, the hard problem has not been dissolved but has become more sharply **articulated**. Its persistence suggests either that we are missing some crucial conceptual **innovation**, or that the relationship between mind and matter is genuinely more **enigmatic** than the reductive ambitions of modern science have so far been able to accommodate.`,
  },
  {
    id: "b9-democracy-crisis",
    title: "Is Liberal Democracy in Crisis?",
    band: "9.0",
    topic: "Politics & Philosophy",
    source: "Cambridge IELTS Academic band 9 model passage, adapted",
    content: `# Is Liberal Democracy in Crisis?

The **proposition** that liberal democracy is in crisis has become one of the defining claims of our era. The **proliferation** of authoritarian populist movements in established democracies, the **erosion** of independent institutions and judicial **autonomy** in countries as varied as Hungary, Turkey, and the United States, and the broader sense that the liberal international order built after 1945 is **fraying** under pressures it was not designed to withstand — all of these developments have prompted serious political scientists to ask whether democracy as we have known it is in **structural** decline.

The diagnosis requires careful **disaggregation**. The formal institutions of democratic governance — elections, legislatures, constitutions — remain in place in most countries that have historically been classified as democracies. What has changed, in many cases, is the quality and robustness of the underlying conditions that make democracy **substantive** rather than merely procedural: the independence of the judiciary and media, the protection of minority rights, the existence of a shared factual **substrate** that allows political disagreement to be conducted on common **epistemic** ground, and the **legitimacy** accorded to democratic outcomes by those who lose elections.

Some scholars argue that the present crisis is not so much a departure from the norm as a **revelation** of contradictions that were always latent in liberal democracy — tensions between its liberal and democratic **components**, and between the formal equality it **proclaims** and the substantive inequalities of wealth and power that shape who can effectively participate in its institutions. On this reading, the **disaffection** with democracy that has fuelled authoritarian populism is not irrational but a rational response to a system that has failed to deliver on its most fundamental **promises** for large portions of its population.

The prescriptions that follow from this analysis differ radically from those that **attribute** democratic backsliding primarily to elite manipulation or institutional **vulnerability**. They suggest that restoring democratic **vitality** requires not merely defending institutions against authoritarian **encroachment** but addressing the material conditions — of economic security, geographic **disparity**, and social recognition — that are producing the **alienation** from which anti-democratic politics draws its energy.`,
  },
  {
    id: "b9-time-physics",
    title: "The Nature of Time",
    band: "9.0",
    topic: "Physics & Philosophy",
    source: "IELTS Academic band 9 model reading, adapted",
    content: `# The Nature of Time

Of all the concepts in physics, time is perhaps the most **intimate** — present in every experience, structuring every thought and perception — and yet, upon examination, among the most deeply **puzzling**. The history of physics has progressively **undermined** the intuitive picture of time as a uniform, universal flow, and contemporary theoretical physics suggests that the nature of time is stranger than any commonsense account could anticipate.

Newton's mechanics assumed an absolute time — a universal clock ticking at a constant rate throughout the universe, providing the **immutable** backdrop against which physical events unfold. Einstein's **special** theory of relativity demolished this picture. Time, Einstein demonstrated, is not absolute but **relative**: its rate of passage depends on the velocity of the observer. Two clocks that are set to the same time and then separated — one remaining stationary, the other travelling at high velocity — will, when reunited, show different times. This "time dilation" is not a measurement artefact but a genuine feature of the physical world, confirmed by countless experiments with extraordinary **precision**.

General relativity added a further complication: time runs at different rates in different **gravitational** fields. Clocks at the Earth's surface tick imperceptibly but measurably more slowly than clocks in orbit — a difference of sufficient **magnitude** that GPS satellites must correct for it to maintain their accuracy. In the extreme conditions near a black hole's **event horizon**, time dilation becomes so severe that, from the **perspective** of a distant observer, infalling matter appears to freeze at the horizon and never quite cross it.

The deepest puzzle is the "**arrow** of time" — the fact that we experience time as flowing exclusively from past to future, even though the fundamental equations of physics are **symmetric** in time and do not, in themselves, **discriminate** between past and future directions. The explanation for this asymmetry is generally traced to the low-entropy **initial** conditions of the universe — the extraordinarily improbable ordered state from which the Big Bang **emerged** — but the question of why the universe began in such a state remains one of the most profound open problems in **cosmology**.`,
  },
  {
    id: "b9-free-will",
    title: "Free Will and Moral Responsibility",
    band: "9.0",
    topic: "Philosophy & Neuroscience",
    source: "Cambridge IELTS band 9 Academic Reading model, adapted",
    content: `# Free Will and Moral Responsibility

The question of whether human beings possess **genuine** free will — the capacity to have acted otherwise than they did, in the strong sense that philosophers call "**libertarian** free will" — has occupied philosophers since antiquity. It has acquired renewed **urgency** in recent decades, as neuroscience has begun to provide empirical evidence that bears on it, and as its implications for legal and moral **responsibility** have moved to the centre of debates in criminal justice and public policy.

The challenge to free will from modern science takes multiple forms. The most fundamental is the **deterministic** picture of the physical world entailed by classical mechanics: if the state of the universe at any moment is fully specified by its physical state and the laws of nature, then every subsequent event — including every thought, decision, and action of every human being — was in **principle** fixed at the moment of the Big Bang. Quantum mechanics introduces genuine **indeterminacy** at the subatomic level, but randomness does not **rescue** the intuitive notion of free will; a decision generated partly by random quantum **fluctuations** is no more an expression of genuine agency than a fully determined one.

The neuroscientific dimension of this debate was **catalysed** by the work of Benjamin Libet in the 1980s, who used electrical measurements of brain activity to demonstrate that the neural **precursors** of a voluntary movement begin several hundred milliseconds before the subject reports a conscious decision to move. Subsequent and more sophisticated versions of this experiment have deepened the finding, suggesting that the conscious experience of deciding may be, at least in part, a **post hoc** rationalisation of decisions made below the level of awareness.

**Compatibilist** philosophers — who constitute the majority in contemporary academic philosophy — argue that this scientific evidence, while **unsettling** to common sense, does not **undermine** the concepts of free will and moral responsibility that actually matter for ethics and law. The freedom that is morally relevant, they contend, is not the metaphysical freedom to have defied the laws of physics but the practical freedom to act in accordance with one's **motivations**, values, and deliberative processes — a freedom that is fully compatible with **determinism** and that neuroscience does not threaten.`,
  },
  {
    id: "b9-complexity-theory",
    title: "Complexity, Emergence and Self-Organisation",
    band: "9.0",
    topic: "Science & Philosophy",
    source: "IELTS band 9 Academic model reading, adapted",
    content: `# Complexity, Emergence and Self-Organisation

One of the most significant intellectual developments of the late twentieth century was the emergence of complexity science — a multidisciplinary field that studies systems **exhibiting** a class of behaviour that resists **decomposition** into the properties of their component parts. Complex systems, whether biological organisms, ecosystems, economies, or social networks, share a set of **structural** and dynamic properties that transcend the specific nature of their constituents: they are **adaptive**, they exhibit non-linear behaviour in which small changes can produce disproportionate effects, and they generate **emergent** properties — properties that exist at the level of the system but are not **reducible** to the properties of individual components.

The concept of emergence is ancient — Aristotle observed that the whole can be more than the sum of its parts — but complexity science has given it **rigorous** mathematical content. The formation of **murmuration** patterns in starling flocks, in which thousands of birds move in seemingly **choreographed** synchrony despite the absence of any coordinating authority, exemplifies emergence in its purest form. Each bird follows simple local rules — maintain a certain distance from neighbours, match their velocity, avoid collisions — yet the result is a pattern of **extraordinary** coherence and adaptability that cannot be predicted from those rules alone.

The philosophical implications of emergence have been **sharply** contested. Reductionists argue that emergent properties, however striking in appearance, are in principle fully explained by the underlying micro-level interactions, and that the appearance of something "more" is an **artefact** of cognitive **limitation** rather than a feature of reality. Emergentists counter that certain system-level properties exercise genuine **downward** causation — that the pattern constrains the behaviour of the components in ways that cannot be captured by a **bottom-up** description.

The practical implications of complexity science are **substantial**. They include the recognition that interventions in complex systems often produce **unintended** consequences — that the very act of attempting to optimise one variable in an interconnected system tends to **propagate** disturbances through multiple pathways in ways that are difficult to anticipate. This insight has been applied across domains from ecological management to economic policy, with the general lesson that **humility** about the **legibility** of complex systems is an intellectual virtue with significant practical value.`,
  },
  {
    id: "b9-philosophy-language",
    title: "Language, Thought and Reality",
    band: "9.0",
    topic: "Linguistics & Philosophy",
    source: "Cambridge IELTS band 9 Academic model, adapted",
    content: `# Language, Thought and Reality

The relationship between language and thought is one of the oldest and most **contested** questions in philosophy and cognitive science. At one extreme stands the view associated with the **Sapir-Whorf** hypothesis — sometimes called "linguistic **determinism**" — that the language one speaks profoundly shapes, or even determines, the thoughts one is capable of thinking. At the other extreme is the view that language is merely a vehicle for expressing thoughts that are formed independently of any particular linguistic structure. The most defensible position lies between these poles, but its precise **contours** remain a matter of active investigation.

The strong version of the **Sapir-Whorf** hypothesis — that language determines thought — is generally regarded as empirically **untenable**. The existence of mathematical reasoning, non-verbal problem-solving, and cross-linguistic translation all suggest that there is a level of cognitive representation that is **prior** to and independent of any particular natural language. The weaker claim — that the language one habitually uses influences certain aspects of thought and **perception** — has received more **empirical** support, particularly in domains such as colour perception, spatial reasoning, and the encoding of temporal relationships.

Guugu Yimithirr, an Australian Aboriginal language, uses only **absolute** spatial terms (north, south, east, west) rather than the **egocentric** terms (left, right, in front, behind) that are standard in European languages. Research has shown that speakers of such languages develop an extraordinary capacity for **geographical** orientation, maintaining a continuous awareness of their **cardinal** position even in **enclosed** spaces. This finding suggests that habitual linguistic practice can cultivate cognitive capacities — or perhaps redirect cognitive resources — in ways that have measurable **perceptual** consequences.

The deeper philosophical question concerns the relationship between language and **reality** at the level of conceptual structure rather than perceptual discrimination. To what extent are the **categories** through which we understand the world — the things, properties, events, and relations that our language **carves** out of the continuous flux of experience — a **projection** of linguistic structure onto an independently existing reality, and to what extent do they track genuine **joints** in nature? This question, which connects philosophy of language to metaphysics, remains as alive today as it was when Kant first asked whether the **categories** of understanding are imposed on experience or derived from it.`,
  },
  {
    id: "b9-evolution-cooperation",
    title: "The Evolution of Human Cooperation",
    band: "9.0",
    topic: "Biology & Anthropology",
    source: "Cambridge IELTS band 9 Academic Reading model, adapted",
    content: `# The Evolution of Human Cooperation

Human beings are **anomalous** among primates in the scale and character of their cooperative behaviour. While other great apes cooperate within small kin groups and in **dyadic** alliances between individuals who know one another personally, humans cooperate with **genetically** unrelated strangers on a scale ranging from the coordination required to manage a local commons to the **massive** cooperative enterprises of nation-states, international institutions, and global markets. Explaining how this capacity evolved — and how it is **sustained** against the ever-present **temptation** to free-ride on others' contributions — is one of the central questions of evolutionary anthropology.

Standard accounts of the evolution of **altruism** — Hamilton's kin selection and Trivers' reciprocal altruism — explain cooperation among related individuals and within long-term bilateral relationships, respectively. They cannot, however, explain the characteristic human capacity to cooperate within large groups of strangers. To account for this, some **evolutionary** theorists have proposed "cultural group selection" — the idea that groups whose members cooperated effectively outcompeted groups whose members defected, leading to the **differential** spread of pro-social **norms**, institutions, and the psychological **dispositions** that underpin them.

This theory remains controversial among evolutionary biologists, many of whom are sceptical that group selection operates on the cultural level in the way its **proponents** claim. An alternative **hypothesis** emphasises the role of cultural evolution in extending the scope of cooperation through the development of specific institutions — markets, legal systems, religions — that create incentives for cooperation among strangers by making defection costly, **monitoring** compliance, and establishing shared norms that coordinate expectations.

The empirical record of cross-cultural research has revealed both the **universality** and the **variability** of human cooperation. Certain tendencies — **reciprocity**, punishment of norm-violators, sensitivity to fairness — appear across cultures, suggesting a common underlying psychological **architecture**. At the same time, the degree to which these tendencies extend to in-group versus out-group members, and the specific norms that govern cooperation, vary **substantially** across societies in ways that appear to be shaped by ecology, subsistence strategy, and the degree of **market** integration. Understanding this **variability** is not merely a theoretical exercise; it bears directly on the most pressing practical challenge of our era — the construction of effective institutions for global cooperation in the face of shared existential threats.`,
  },
  {
    id: "b9-entropy-universe",
    title: "Entropy and the Fate of the Universe",
    band: "9.0",
    topic: "Physics & Cosmology",
    source: "IELTS Academic band 9 model, adapted",
    content: `# Entropy and the Fate of the Universe

The second law of thermodynamics — that the **entropy** of a closed system tends to increase over time — is among the most **consequential** principles in all of physics. Entropy, loosely speaking, is a measure of disorder or the number of microscopic configurations **compatible** with a system's macroscopic state. The second law tells us that systems **spontaneously** evolve towards more disordered states: heat flows from hot objects to cold ones, gases expand to fill their containers, and complex **structured** objects tend to break down rather than form of their own accord.

The implications of this principle extend far beyond the laboratory. The entire story of cosmic **evolution** — from the extraordinarily ordered low-entropy state of the early universe through the formation of stars, planets, and life, to the eventual heat death of a universe in maximum-entropy equilibrium — can be read as a single vast drama in which **entropy** is the protagonist. Stars, including our own Sun, are in essence entropy-generation machines: they create order locally (in the form of life and complex chemistry on nearby planets) by **dissipating** enormous quantities of energy into the environment, thereby increasing the total entropy of the universe.

The **puzzling** feature of this picture is its asymmetry. The laws of physics are, with minor and controversial exceptions, **symmetric** in time: they look the same whether run forwards or backwards. Yet the second law is **emphatically** not time-symmetric; it defines an arrow of time pointing from low to high entropy. The resolution of this puzzle — why the universe began in such an extraordinarily low-entropy state — remains one of the deepest unsolved problems in physics.

Some cosmologists, including Roger Penrose, have proposed that the low-entropy initial condition of our universe is not an arbitrary **brute** fact but a consequence of a deeper theoretical framework — perhaps a **cyclic** cosmology in which the endpoint of one universe's expansion provides the initial condition for the next, or a **multiverse** scenario in which we necessarily find ourselves in one of the **rare** low-entropy regions because only such regions permit the existence of observers capable of asking the question.`,
  },
  {
    "id": "extra-b70-urban-green-spaces",
    "title": "Urban Green Spaces and Public Health",
    "band": "7.0",
    "topic": "Cities & Health",
    "source": "Original IELTS-style practice passage",
    "content": "# Urban Green Spaces and Public Health\n\nThe debate over **parks in dense cities** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For municipal planners, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that parks in dense cities can strengthen **neighbourhood wellbeing** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. public health researchers emphasise the danger of **equitable access**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **practical** caution. trees, shade and safe walking routes would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b70-digital-payments",
    "title": "The Rise of Digital Payments",
    "band": "7.0",
    "topic": "Technology & Economy",
    "source": "Original IELTS-style practice passage",
    "content": "# The Rise of Digital Payments\n\nThe debate over **cashless transactions** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For banks and technology firms, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that cashless transactions can strengthen **financial inclusion** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. consumer advocates emphasise the danger of **privacy and fraud**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **practical** caution. simple, transparent payment systems would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b70-school-start-times",
    "title": "Should Schools Start Later?",
    "band": "7.0",
    "topic": "Education & Health",
    "source": "Original IELTS-style practice passage",
    "content": "# Should Schools Start Later?\n\nThe debate over **later school start times** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For sleep scientists, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that later school start times can strengthen **adolescent concentration** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. parents and schools emphasise the danger of **transport schedules**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **practical** caution. evidence-based timetables would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b70-food-waste",
    "title": "Reducing Food Waste",
    "band": "7.0",
    "topic": "Environment & Society",
    "source": "Original IELTS-style practice passage",
    "content": "# Reducing Food Waste\n\nThe debate over **food waste** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For supermarkets and households, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that food waste can strengthen **lower emissions** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. environmental campaigners emphasise the danger of **consumer habits**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **practical** caution. clear labels and better storage would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b70-public-transport",
    "title": "Investing in Public Transport",
    "band": "7.0",
    "topic": "Urban Planning",
    "source": "Original IELTS-style practice passage",
    "content": "# Investing in Public Transport\n\nThe debate over **public transport investment** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For city governments, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that public transport investment can strengthen **reduced congestion** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. commuters and employers emphasise the danger of **funding constraints**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **practical** caution. reliable buses and integrated fares would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b70-online-education-access",
    "title": "Online Education and Access",
    "band": "7.0",
    "topic": "Education & Technology",
    "source": "Original IELTS-style practice passage",
    "content": "# Online Education and Access\n\nThe debate over **online learning** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For universities and platforms, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that online learning can strengthen **wider participation** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. students in remote areas emphasise the danger of **unequal internet access**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **practical** caution. blended learning support would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b70-workplace-wellbeing",
    "title": "Workplace Wellbeing Programmes",
    "band": "7.0",
    "topic": "Work & Health",
    "source": "Original IELTS-style practice passage",
    "content": "# Workplace Wellbeing Programmes\n\nThe debate over **wellbeing programmes at work** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For large employers, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that wellbeing programmes at work can strengthen **reduced burnout** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. occupational psychologists emphasise the danger of **tokenistic initiatives**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **practical** caution. manageable workloads would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b75-urban-farming",
    "title": "Urban Farming and Food Security",
    "band": "7.5",
    "topic": "Cities & Environment",
    "source": "Original IELTS-style practice passage",
    "content": "# Urban Farming and Food Security\n\nThe debate over **urban farming** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For local councils, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that urban farming can strengthen **resilient food networks** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. community groups emphasise the danger of **limited space and soil contamination**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **policy** caution. rooftop gardens and training schemes would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b75-algorithmic-recruitment",
    "title": "Algorithms in Recruitment",
    "band": "7.5",
    "topic": "Work & Technology",
    "source": "Original IELTS-style practice passage",
    "content": "# Algorithms in Recruitment\n\nThe debate over **algorithmic hiring tools** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For human resource departments, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that algorithmic hiring tools can strengthen **efficient screening** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. legal scholars emphasise the danger of **hidden bias**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **policy** caution. audited decision systems would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b75-tourism-carrying-capacity",
    "title": "Tourism and Carrying Capacity",
    "band": "7.5",
    "topic": "Travel & Environment",
    "source": "Original IELTS-style practice passage",
    "content": "# Tourism and Carrying Capacity\n\nThe debate over **mass tourism** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For destination managers, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that mass tourism can strengthen **economic opportunity** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. local residents emphasise the danger of **environmental degradation**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **policy** caution. visitor caps and local ownership would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b75-elderly-care-technology",
    "title": "Technology in Elderly Care",
    "band": "7.5",
    "topic": "Health & Society",
    "source": "Original IELTS-style practice passage",
    "content": "# Technology in Elderly Care\n\nThe debate over **care technologies for older adults** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For health providers, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that care technologies for older adults can strengthen **independent living** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. families and carers emphasise the danger of **social isolation**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **policy** caution. human-centred monitoring would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b75-water-scarcity",
    "title": "Managing Water Scarcity",
    "band": "7.5",
    "topic": "Environment & Policy",
    "source": "Original IELTS-style practice passage",
    "content": "# Managing Water Scarcity\n\nThe debate over **water scarcity** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For regional authorities, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that water scarcity can strengthen **long-term resilience** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. farmers and households emphasise the danger of **political resistance**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **policy** caution. pricing, recycling and conservation would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b75-creative-industries",
    "title": "The Value of Creative Industries",
    "band": "7.5",
    "topic": "Economy & Culture",
    "source": "Original IELTS-style practice passage",
    "content": "# The Value of Creative Industries\n\nThe debate over **creative industries** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For policy makers, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that creative industries can strengthen **economic diversification** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. artists and entrepreneurs emphasise the danger of **unstable income**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **policy** caution. grants, training and fair contracts would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b75-language-learning-ai",
    "title": "AI in Language Learning",
    "band": "7.5",
    "topic": "Education & AI",
    "source": "Original IELTS-style practice passage",
    "content": "# AI in Language Learning\n\nThe debate over **AI language tutors** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For software companies, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that AI language tutors can strengthen **personalised practice** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. teachers and learners emphasise the danger of **over-reliance on automated feedback**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **policy** caution. teacher-guided digital practice would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b80-carbon-labelling",
    "title": "Carbon Labelling on Products",
    "band": "8.0",
    "topic": "Climate & Consumer Behaviour",
    "source": "Original IELTS-style practice passage",
    "content": "# Carbon Labelling on Products\n\nThe debate over **carbon labels** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For retailers and regulators, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that carbon labels can strengthen **informed consumption** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. climate economists emphasise the danger of **confusing measurement standards**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **strategic** caution. simple labelling with verified data would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b80-universal-basic-services",
    "title": "Universal Basic Services",
    "band": "8.0",
    "topic": "Public Policy",
    "source": "Original IELTS-style practice passage",
    "content": "# Universal Basic Services\n\nThe debate over **universal basic services** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For governments, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that universal basic services can strengthen **social security** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. social policy researchers emphasise the danger of **fiscal sustainability**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **strategic** caution. targeted universalism would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b80-gene-editing-crops",
    "title": "Gene Editing and Crop Resilience",
    "band": "8.0",
    "topic": "Science & Agriculture",
    "source": "Original IELTS-style practice passage",
    "content": "# Gene Editing and Crop Resilience\n\nThe debate over **gene-edited crops** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For biotechnology firms, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that gene-edited crops can strengthen **climate adaptation** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. food security experts emphasise the danger of **public mistrust**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **strategic** caution. transparent trials and regulation would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b80-remote-healthcare",
    "title": "Remote Healthcare Consultations",
    "band": "8.0",
    "topic": "Health & Technology",
    "source": "Original IELTS-style practice passage",
    "content": "# Remote Healthcare Consultations\n\nThe debate over **remote healthcare** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For medical systems, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that remote healthcare can strengthen **convenient access** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. patients and clinicians emphasise the danger of **diagnostic limitations**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **strategic** caution. hybrid clinical pathways would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b80-media-literacy",
    "title": "Media Literacy in Schools",
    "band": "8.0",
    "topic": "Education & Democracy",
    "source": "Original IELTS-style practice passage",
    "content": "# Media Literacy in Schools\n\nThe debate over **media literacy education** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For schools, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that media literacy education can strengthen **critical judgement** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. democracy advocates emphasise the danger of **crowded curricula**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **strategic** caution. integrated reading and verification skills would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b80-circular-economy",
    "title": "The Circular Economy",
    "band": "8.0",
    "topic": "Economy & Environment",
    "source": "Original IELTS-style practice passage",
    "content": "# The Circular Economy\n\nThe debate over **circular economy models** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For manufacturers, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that circular economy models can strengthen **resource efficiency** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. environmental economists emphasise the danger of **upfront redesign costs**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **strategic** caution. repair, reuse and product standards would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b80-migration-ageing",
    "title": "Migration and Ageing Societies",
    "band": "8.0",
    "topic": "Demography & Policy",
    "source": "Original IELTS-style practice passage",
    "content": "# Migration and Ageing Societies\n\nThe debate over **migration in ageing societies** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For national governments, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that migration in ageing societies can strengthen **labour market renewal** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. demographers emphasise the danger of **integration challenges**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **strategic** caution. language support and credential recognition would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b85-attention-economy-regulation",
    "title": "Regulating the Attention Economy",
    "band": "8.5",
    "topic": "Technology & Society",
    "source": "Original IELTS-style practice passage",
    "content": "# Regulating the Attention Economy\n\nThe debate over **attention-based platforms** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For technology regulators, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that attention-based platforms can strengthen **healthier digital environments** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. behavioural scientists emphasise the danger of **free expression concerns**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **institutional** caution. design standards and transparency would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b85-deep-sea-mining",
    "title": "Deep-Sea Mining and Risk",
    "band": "8.5",
    "topic": "Environment & Resources",
    "source": "Original IELTS-style practice passage",
    "content": "# Deep-Sea Mining and Risk\n\nThe debate over **deep-sea mining** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For mining companies, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that deep-sea mining can strengthen **critical mineral supply** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. marine biologists emphasise the danger of **irreversible ecosystem damage**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **institutional** caution. precautionary governance would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b85-predictive-policing",
    "title": "Predictive Policing",
    "band": "8.5",
    "topic": "Law & Technology",
    "source": "Original IELTS-style practice passage",
    "content": "# Predictive Policing\n\nThe debate over **predictive policing systems** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For police departments, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that predictive policing systems can strengthen **efficient resource allocation** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. civil rights organisations emphasise the danger of **self-reinforcing surveillance**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **institutional** caution. public audits and strict limits would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b85-synthetic-media",
    "title": "Synthetic Media and Trust",
    "band": "8.5",
    "topic": "Media & AI",
    "source": "Original IELTS-style practice passage",
    "content": "# Synthetic Media and Trust\n\nThe debate over **synthetic media** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For AI developers, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that synthetic media can strengthen **creative expression** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. journalists and courts emphasise the danger of **erosion of evidential trust**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **institutional** caution. authentication infrastructure would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b85-rewilding",
    "title": "Rewilding Degraded Landscapes",
    "band": "8.5",
    "topic": "Ecology & Land Use",
    "source": "Original IELTS-style practice passage",
    "content": "# Rewilding Degraded Landscapes\n\nThe debate over **rewilding projects** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For conservation bodies, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that rewilding projects can strengthen **ecosystem recovery** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. rural communities emphasise the danger of **conflict over land use**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **institutional** caution. local compensation and ecological monitoring would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b85-lifelong-learning",
    "title": "Lifelong Learning and Economic Change",
    "band": "8.5",
    "topic": "Education & Economy",
    "source": "Original IELTS-style practice passage",
    "content": "# Lifelong Learning and Economic Change\n\nThe debate over **lifelong learning** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For employers and colleges, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that lifelong learning can strengthen **career resilience** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. workers facing automation emphasise the danger of **time and cost barriers**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **institutional** caution. portable training accounts would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b85-public-interest-ai",
    "title": "Public Interest AI",
    "band": "8.5",
    "topic": "Technology & Governance",
    "source": "Original IELTS-style practice passage",
    "content": "# Public Interest AI\n\nThe debate over **public interest AI** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For research institutions, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that public interest AI can strengthen **socially useful automation** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. policy makers emphasise the danger of **commercial capture**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **institutional** caution. open evaluation and public funding would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b90-epistemic-humility",
    "title": "Epistemic Humility in Public Debate",
    "band": "9.0",
    "topic": "Philosophy & Society",
    "source": "Original IELTS-style practice passage",
    "content": "# Epistemic Humility in Public Debate\n\nThe debate over **epistemic humility** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For public intellectuals, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that epistemic humility can strengthen **better collective reasoning** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. scientists and citizens emphasise the danger of **performative certainty**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **conceptual** caution. institutions that reward revision would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b90-longtermism-policy",
    "title": "Long-Term Thinking in Policy",
    "band": "9.0",
    "topic": "Politics & Ethics",
    "source": "Original IELTS-style practice passage",
    "content": "# Long-Term Thinking in Policy\n\nThe debate over **long-term policy making** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For governments, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that long-term policy making can strengthen **intergenerational justice** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. future generations advocates emphasise the danger of **democratic short-termism**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **conceptual** caution. independent foresight bodies would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b90-neurotechnology-consent",
    "title": "Neurotechnology and Consent",
    "band": "9.0",
    "topic": "Neuroscience & Ethics",
    "source": "Original IELTS-style practice passage",
    "content": "# Neurotechnology and Consent\n\nThe debate over **consumer neurotechnology** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For device manufacturers, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that consumer neurotechnology can strengthen **medical innovation** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. bioethicists emphasise the danger of **mental privacy risks**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **conceptual** caution. rights-based regulation would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b90-commons-governance",
    "title": "Governing the Global Commons",
    "band": "9.0",
    "topic": "International Relations",
    "source": "Original IELTS-style practice passage",
    "content": "# Governing the Global Commons\n\nThe debate over **global commons governance** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For international institutions, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that global commons governance can strengthen **shared resource protection** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. climate and ocean scientists emphasise the danger of **collective action failure**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **conceptual** caution. binding cooperation and verification would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b90-measurement-society",
    "title": "The Tyranny of Measurement",
    "band": "9.0",
    "topic": "Sociology & Policy",
    "source": "Original IELTS-style practice passage",
    "content": "# The Tyranny of Measurement\n\nThe debate over **measurement-driven management** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For public agencies, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that measurement-driven management can strengthen **accountability** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. social theorists emphasise the danger of **distorted incentives**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **conceptual** caution. qualitative judgement alongside metrics would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b90-memory-public-history",
    "title": "Memory and Public History",
    "band": "9.0",
    "topic": "History & Identity",
    "source": "Original IELTS-style practice passage",
    "content": "# Memory and Public History\n\nThe debate over **public memory** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For museums and schools, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that public memory can strengthen **civic understanding** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. historians and communities emphasise the danger of **politicised remembrance**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **conceptual** caution. plural narratives and evidence would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
  {
    "id": "extra-b90-planetary-boundaries",
    "title": "Planetary Boundaries and Development",
    "band": "9.0",
    "topic": "Earth Systems",
    "source": "Original IELTS-style practice passage",
    "content": "# Planetary Boundaries and Development\n\nThe debate over **planetary boundaries** has become increasingly visible as societies try to balance immediate convenience with longer-term social consequences. For development agencies, the issue is rarely a simple matter of adopting a new tool or rejecting an old habit. It involves questions of cost, trust, access and public value, all of which shape whether a reform can move beyond a promising idea into everyday practice.\n\nSupporters argue that planetary boundaries can strengthen **safe human prosperity** when it is implemented carefully. They point out that many existing systems already fail large groups of people, either by excluding them altogether or by providing services that are slow, fragmented and poorly matched to real needs. From this perspective, reform is not merely desirable but necessary, because inaction often preserves hidden forms of inefficiency and unfairness.\n\nCritics, however, warn that the benefits are frequently overstated. earth system scientists emphasise the danger of **growth-dependent institutions**, especially when decisions are made quickly or when accountability is weak. Their concern is not always opposition to change itself; rather, it is that poorly designed change may transfer costs onto people with the least power to resist. This is why evidence, transparency and public participation matter as much as technical performance.\n\nA more convincing approach would combine ambition with **conceptual** caution. development within ecological limits would not solve every problem, but it would reduce the likelihood that reform becomes either symbolic or harmful. The central lesson is that progress depends less on the novelty of a proposal than on the quality of the institutions that govern it."
  },
];
