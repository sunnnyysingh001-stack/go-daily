export type Chapter={id:string;name:string;scope:string;facts?:string[][];kind?:string};
export type Subject={id:string;name:string;short:string;paper:string;color:string;syllabus:string;chapters:Chapter[]};
const chapter=(id:string,name:string,scope:string,lines:string):Chapter=>({id,name,scope,facts:lines.trim().split('\n').map(x=>x.split('|'))});
export const subjects:Subject[]=[
{id:'polity',name:'Indian Polity & Governance',short:'Polity',paper:'GS I',color:'#e9a34e',syllabus:'Constitution, political system, Panchayati Raj, public policy and rights issues.',chapters:[
chapter('constitution','Constitution & Rights','Preamble, constitutional principles, fundamental rights, duties and directive principles.',`
The Preamble declares India a republic.|The Preamble declares India a hereditary monarchy.
The Constitution came into force on 26 January 1950.|The Constitution came into force on 15 August 1947.
Fundamental Rights are principally contained in Part III.|Fundamental Rights are principally contained in Part IV.
Directive Principles are principally contained in Part IV.|Directive Principles are principally contained in Part III.
Article 32 provides a remedy for enforcement of Fundamental Rights.|Article 32 establishes the Finance Commission.
Article 14 guarantees equality before law to all persons.|Article 14 applies only to Indian citizens.
Article 19 freedoms are guaranteed to citizens.|Article 19 freedoms are guaranteed only to foreign nationals.
Article 21 protects life and personal liberty.|Article 21 establishes the GST Council.
Fundamental Duties are contained in Part IVA.|Fundamental Duties are contained in Part IX.
Directive Principles are not enforceable by courts by themselves.|Every Directive Principle is directly enforceable by courts.
The basic structure doctrine limits Parliament's amending power.|Parliament can destroy the Constitution's basic structure through amendment.
The writ of habeas corpus safeguards against unlawful detention.|Habeas corpus is a writ for collecting customs duties.
Article 17 abolishes untouchability.|Article 17 authorises untouchability in private institutions.
The right to property is a constitutional right under Article 300A.|The right to property is currently a Fundamental Right under Article 19.
Secularism is a feature of the Indian constitutional system.|The Constitution establishes a single compulsory state religion.
`),
chapter('institutions','Parliament, Executive & Judiciary','Legislative procedures, President, ministries, judicial review and constitutional bodies.',`
The Council of Ministers is collectively responsible to the Lok Sabha.|The Council of Ministers is collectively responsible only to the Rajya Sabha.
The Rajya Sabha is a permanent House.|The Rajya Sabha is dissolved after every general election.
A Money Bill can be introduced only in the Lok Sabha.|A Money Bill can be introduced only in the Rajya Sabha.
The Speaker certifies whether a Bill is a Money Bill.|The Chief Justice certifies whether a Bill is a Money Bill.
The President is part of Parliament under Article 79.|Parliament consists only of the Prime Minister and Governors.
The President appoints the Prime Minister.|The Chief Election Commissioner appoints the Prime Minister.
The Vice-President is ex officio Chairman of the Rajya Sabha.|The Vice-President is ex officio Speaker of the Lok Sabha.
The Supreme Court can review the constitutionality of legislation.|The Supreme Court cannot review any legislation.
High Courts can issue writs under Article 226.|Only the Supreme Court can issue constitutional writs.
The CAG audits government accounts as prescribed by law.|The CAG frames monetary policy for commercial banks.
UPSC is a constitutional body.|UPSC was created solely by an executive resolution.
An ordinance has to be placed before Parliament when it reassembles.|An ordinance never requires parliamentary consideration.
The Attorney General is the highest law officer of the Union.|The Attorney General is the head of the Election Commission.
A no-confidence motion is moved in the Lok Sabha.|A no-confidence motion against the Union ministry is decided only in the Rajya Sabha.
A joint sitting is not provided for a constitutional amendment Bill.|Every constitutional amendment Bill must pass through a joint sitting.
`),
chapter('federalism','Federalism & Local Government','Union–State relations, schedules, finance, municipalities and Panchayats.',`
The Seventh Schedule contains the Union, State and Concurrent Lists.|The Seventh Schedule contains the list of recognised languages.
Residuary legislative powers lie with Parliament.|Residuary legislative powers lie exclusively with village Panchayats.
The 73rd Amendment concerns Panchayats.|The 73rd Amendment created the Supreme Court.
The 74th Amendment concerns municipalities.|The 74th Amendment concerns only national emergency.
The Eleventh Schedule relates to Panchayats.|The Eleventh Schedule lists Union ministries.
The Twelfth Schedule relates to municipalities.|The Twelfth Schedule lists Fundamental Rights.
A Gram Sabha consists of registered voters in its village area.|A Gram Sabha consists only of elected MPs.
The Finance Commission is constituted under Article 280.|The Finance Commission is constituted under Article 356.
State Election Commissions supervise local body elections.|Local body elections are constitutionally supervised by the CAG.
The Governor is appointed by the President.|The Governor is directly elected by the state's voters.
Article 356 concerns failure of constitutional machinery in a State.|Article 356 concerns the election of municipal councillors.
The Inter-State Council has a constitutional basis in Article 263.|The Inter-State Council is a chamber of Parliament.
Education is in the Concurrent List.|Education is exclusively in the Union List.
Police is ordinarily a State List subject.|Police is ordinarily a Concurrent List subject.
GST Council is provided for under Article 279A.|GST Council is provided for under Article 21A.
`),
chapter('governance','Elections, Public Policy & Accountability','Electoral institutions, transparency, welfare delivery and citizen participation.',`
The Election Commission is provided for under Article 324.|The Election Commission is provided for under Article 360.
Adult suffrage is the basis of Lok Sabha elections.|Property ownership is compulsory for voting in Lok Sabha elections.
The voting age was lowered to 18 by the 61st Amendment.|The voting age was lowered to 18 by the 42nd Amendment.
The Model Code of Conduct guides conduct during elections.|The Model Code of Conduct is a chapter of the Constitution.
RTI enables citizens to seek information subject to statutory exemptions.|RTI makes every government record public without any exemption.
Social audits involve public scrutiny of programme implementation.|Social audits are identical to a secret ballot in Parliament.
The Lokpal is established by legislation.|The Lokpal is one of the two Houses of Parliament.
Public Interest Litigation can facilitate access to justice.|Public Interest Litigation can be filed only by the President.
Delegated legislation is made under authority granted by a parent law.|Delegated legislation can never be reviewed by courts.
Citizen charters set out service standards and commitments.|Citizen charters automatically amend the Constitution.
Decentralisation can bring decision-making closer to citizens.|Decentralisation means transferring all village powers to the Union.
Transparency and accountability are related but distinct principles.|Transparency and accountability always mean exactly the same thing.
The National Human Rights Commission is a statutory body.|The National Human Rights Commission is a constitutional court.
The anti-defection provisions are in the Tenth Schedule.|The anti-defection provisions are in the Eighth Schedule.
Public consultation can improve the information available to policymakers.|Public consultation legally replaces Parliament for passing every law.
`)]},
{id:'history',name:'History & Indian Culture',short:'History',paper:'GS I',color:'#bc8cdf',syllabus:'History of India and the Indian National Movement; cultural context for historical questions.',chapters:[
chapter('ancient','Ancient India','Harappan civilisation, Vedic society, Buddhism, Jainism, empires and sources.',`
Harappan cities are known for planned drainage systems.|Harappan cities are known for widespread iron railway networks.
The Harappan script has not been conclusively deciphered.|The Harappan script has been completely deciphered with universal scholarly agreement.
The Great Bath is associated with Mohenjo-daro.|The Great Bath is associated with Pataliputra.
The Rigveda is the oldest of the four Vedas.|The Atharvaveda is the oldest of the four Vedas.
Buddhism teaches the Four Noble Truths.|The Four Noble Truths are a doctrine of Mughal administration.
Mahavira is regarded as the 24th Jain Tirthankara.|Mahavira is regarded as the first Jain Tirthankara.
Ashoka belonged to the Mauryan dynasty.|Ashoka belonged to the Chola dynasty.
Many Ashokan inscriptions were composed in Prakrit.|All Ashokan inscriptions were composed in English.
The Arthashastra is traditionally associated with Kautilya.|The Arthashastra is traditionally associated with Kalidasa.
Megasthenes visited the court of Chandragupta Maurya.|Megasthenes visited the court of Akbar.
The Allahabad pillar inscription praises Samudragupta.|The Allahabad pillar inscription praises Shivaji as a Gupta king.
Sangam literature is associated with ancient Tamil society.|Sangam literature originated in medieval Europe.
Nalanda was an important centre of Buddhist learning.|Nalanda was a Portuguese naval base.
Coins and inscriptions are important historical sources.|Only modern novels can serve as sources for ancient history.
The Satavahanas were associated with the Deccan.|The Satavahanas ruled exclusively in Scandinavia.
`),
chapter('medieval-culture','Medieval India & Art and Culture','Sultanates, Mughals, Bhakti–Sufi movements, architecture, painting and literature.',`
The Qutb complex is located in Delhi.|The Qutb complex is located in Madurai.
The Cholas are associated with major bronze sculptures.|The Cholas are associated only with miniature oil paintings on canvas.
Brihadisvara Temple is located at Thanjavur.|Brihadisvara Temple is located at Sarnath.
Nagara and Dravida are major temple architectural styles.|Nagara and Dravida are modern parliamentary committees.
Ajanta is noted for Buddhist rock-cut caves and paintings.|Ajanta is a Mughal port city on the Arabian Sea.
The Alvars were associated with devotion to Vishnu.|The Alvars were exclusively Persian court chroniclers.
The Nayanars were associated with devotion to Shiva.|The Nayanars were Buddhist rulers of Tibet.
Kabir questioned rigid religious divisions.|Kabir founded the Delhi Sultanate.
Sufi khanqahs were centres of spiritual activity.|Sufi khanqahs were exclusively minting factories.
The Vijayanagara capital is associated with Hampi.|The Vijayanagara capital is associated with Harappa.
Akbar used the mansabdari system.|Akbar introduced the Indian Civil Service examination in London.
The Ain-i-Akbari is associated with Abul Fazl.|The Ain-i-Akbari was composed by Megasthenes.
The Taj Mahal was built under Shah Jahan.|The Taj Mahal was built under Chandragupta Maurya.
Kathakali is associated with Kerala.|Kathakali originated as an Arctic dance tradition.
Sattriya is associated with Assam.|Sattriya is associated exclusively with Rajasthan.
`),
chapter('modern','Modern India & Freedom Struggle','Colonial expansion, reform, popular movements and the road to independence.',`
The Battle of Plassey was fought in 1757.|The Battle of Plassey was fought in 1857.
The Permanent Settlement was introduced in Bengal in 1793.|The Permanent Settlement was introduced by the Constitution in 1950.
The Revolt of 1857 preceded the transfer of rule to the British Crown.|The Revolt of 1857 occurred after India's independence.
The Indian National Congress was founded in 1885.|The Indian National Congress was founded in 1757.
The Swadeshi movement gained impetus after Bengal's partition in 1905.|The Swadeshi movement began in response to the 1947 partition alone.
The Home Rule movements were associated with Tilak and Annie Besant.|The Home Rule movements were led by Lord Cornwallis and Warren Hastings.
Champaran Satyagraha concerned indigo cultivators.|Champaran Satyagraha concerned only Bombay textile mill workers.
The Jallianwala Bagh massacre occurred in 1919.|The Jallianwala Bagh massacre occurred in 1905.
The Non-Cooperation Movement was withdrawn after Chauri Chaura.|The Non-Cooperation Movement was withdrawn after the Battle of Buxar.
The Dandi March challenged the colonial salt law.|The Dandi March supported the colonial salt monopoly.
The Poona Pact concerned representation of the depressed classes.|The Poona Pact created the World Trade Organization.
The Government of India Act 1935 introduced provincial autonomy.|The Government of India Act 1935 immediately granted complete independence.
The Quit India Movement was launched in 1942.|The Quit India Movement was launched in 1885.
The Cabinet Mission came to India in 1946.|The Cabinet Mission came to India in 1757.
Raja Rammohan Roy was associated with the Brahmo Samaj.|Raja Rammohan Roy founded the Indian National Army.
`)]},
{id:'geography',name:'Indian & World Geography',short:'Geography',paper:'GS I',color:'#61b6d2',syllabus:'Physical, social and economic geography of India and the world.',chapters:[
chapter('physical','Physical Geography','Geomorphology, atmosphere, climatology and oceanography.',`
Earth's lithosphere is divided into moving plates.|Earth's lithosphere is a single immovable plate.
Divergent plate boundaries can create new oceanic crust.|Divergent plate boundaries always destroy all oceanic crust.
S-waves do not travel through liquids.|S-waves travel through liquids as readily as through solids.
Igneous rocks form from cooling magma or lava.|Igneous rocks form only from compacted leaves.
The troposphere contains most weather phenomena.|Most weather phenomena occur in the exosphere.
Atmospheric pressure generally decreases with altitude.|Atmospheric pressure always increases with altitude.
The Coriolis effect is zero at the equator.|The Coriolis effect is strongest at the equator.
Trade winds blow from subtropical highs towards the equatorial low.|Trade winds blow from the equatorial low towards the poles in a straight line.
Warm air can hold more water vapour at saturation than cold air.|Warm air always holds less water vapour at saturation than cold air.
Orographic rainfall involves air rising over relief.|Orographic rainfall requires no upward movement of air.
Ocean tides are strongly influenced by lunar gravity.|Ocean tides are caused only by river discharge.
El Niño involves anomalous warming in the central and eastern equatorial Pacific.|El Niño refers only to snowfall in the Sahara.
Coral reefs generally thrive in warm shallow sunlit seas.|Reef-building corals generally thrive only in permanently dark deep trenches.
Isobars join places of equal atmospheric pressure.|Isobars join places of equal rainfall.
Latitude is angular distance north or south of the equator.|Latitude is measured east or west of Greenwich.
`),
chapter('india-geography','India: Relief, Rivers & Climate','Physiographic divisions, monsoon, soils, vegetation and drainage.',`
The Himalayas are young fold mountains.|The Himalayas are ancient volcanic islands.
The Northern Plains contain extensive alluvial deposits.|The Northern Plains consist entirely of recent lava flows.
The Western Ghats run roughly parallel to India's west coast.|The Western Ghats run roughly parallel to India's northeast international border.
The Narmada flows westwards into the Arabian Sea.|The Narmada flows eastwards into the Bay of Bengal.
The Brahmaputra enters India through Arunachal Pradesh.|The Brahmaputra enters India through Gujarat.
The Godavari is a major peninsular river.|The Godavari originates in the Tibetan Plateau.
Black soils are known for substantial moisture retention.|Black soils cannot retain any moisture.
Laterite soils develop under intense leaching in suitable hot wet conditions.|Laterite soils develop only under permanent polar ice.
The southwest monsoon supplies much of India's annual rainfall.|The southwest monsoon never reaches the Indian mainland.
Tamil Nadu receives significant rainfall during the northeast monsoon.|Tamil Nadu receives no rainfall during the northeast monsoon.
Western disturbances bring winter precipitation to northwestern India.|Western disturbances originate only in the Bay of Bengal during May.
The Sundarbans contain extensive mangroves.|The Sundarbans are a high-altitude alpine desert.
The Deccan Trap is associated with basaltic lava flows.|The Deccan Trap consists exclusively of coral reefs.
The Lakshadweep islands are largely coral islands.|The Lakshadweep islands are Himalayan peaks.
India's standard meridian is 82.5 degrees east.|India's standard meridian is 82.5 degrees west.
`),
chapter('human-geography','Resources, Agriculture & Human Geography','Population, settlements, industries, transport and world map connections.',`
Population density expresses population relative to area.|Population density is measured only by birth rate.
Urbanisation involves an increasing urban share of population.|Urbanisation means that every rural settlement disappears immediately.
Migration can alter both population size and composition.|Migration cannot affect the age structure of a population.
The demographic transition relates development to changing birth and death rates.|The demographic transition describes only plate movements.
Rice generally requires more standing water than millets.|Millets always require more standing water than paddy rice.
Wheat is a major rabi crop in India.|Wheat is exclusively a plantation tree crop.
Cotton requires a sufficiently long frost-free growing period.|Cotton grows best under year-round frost.
Iron and steel industries use inputs such as iron ore and energy.|Iron and steel industries require no mineral or energy inputs.
Ports connect inland economies to maritime trade.|Ports serve only air transport.
The Suez Canal links the Mediterranean Sea with the Red Sea.|The Suez Canal links the Pacific Ocean with the Caribbean Sea.
The Panama Canal connects the Atlantic and Pacific ocean systems.|The Panama Canal connects the Caspian and Aral Seas.
The Strait of Malacca is an important Asian shipping passage.|The Strait of Malacca lies between Greenland and Iceland.
Renewable resources can still be depleted when used unsustainably.|Every renewable resource is immune to overexploitation.
Watershed management considers a drainage basin as a unit.|Watershed management ignores drainage boundaries entirely.
Agglomeration economies arise from concentration of economic activity.|Agglomeration economies require every firm to be geographically isolated.
`)]},
{id:'economy',name:'Economy & Development',short:'Economy',paper:'GS I',color:'#68b99e',syllabus:'Economic and social development, sustainable development, poverty, inclusion, demographics and social-sector initiatives.',chapters:[
chapter('macro','Growth, Inflation & National Income','National accounts, business cycles, prices and employment.',`
GDP measures production within a country's economic territory.|GDP measures only production by citizens living abroad.
Real GDP adjusts for changes in prices.|Real GDP is never adjusted for price changes.
Nominal GDP is measured at current prices.|Nominal GDP is always measured at fixed base-year prices.
Inflation is a sustained rise in the general price level.|Inflation is any rise in the price of one product alone.
Disinflation means a decline in the rate of inflation.|Disinflation necessarily means that the general price level is falling.
Deflation is a decline in the general price level.|Deflation means faster positive inflation.
Consumer price indices track a representative consumption basket.|Consumer price indices measure only stock market prices.
Value added avoids counting intermediate output repeatedly.|Value added deliberately counts every intermediate transaction twice.
Depreciation reflects consumption of fixed capital.|Depreciation of fixed capital is identical to all tax revenue.
Per-capita income alone does not measure income distribution.|Per-capita income completely describes income inequality.
Disguised unemployment can involve workers with near-zero marginal output.|Disguised unemployment means every worker produces maximum possible output.
Labour-force participation relates the labour force to a defined population group.|Labour-force participation is the same as the inflation rate.
A recession involves a significant decline in economic activity.|A recession means an unavoidable permanent end to all production.
Public goods are typically non-rival and non-excludable.|Public goods are defined solely by a high market price.
Externalities affect third parties outside a transaction.|Externalities can affect only the buyer and seller themselves.
`),
chapter('banking','Money, Banking & Monetary Policy','Central banking, credit, financial markets and monetary tools.',`
The RBI is India's central bank.|The RBI is India's highest criminal court.
The repo rate concerns central bank lending against eligible securities.|The repo rate is a tax on agricultural land.
CRR requires banks to hold a proportion of specified liabilities with the RBI.|CRR requires banks to invest all deposits in company shares.
Open market operations involve purchases or sales of government securities.|Open market operations refer only to selling food in retail shops.
Higher policy rates can restrain credit demand, other things equal.|Higher policy rates always increase every borrower's demand for loans.
Commercial banks can create deposit money through lending.|Commercial banks create money only by printing currency notes.
Bond prices and yields usually move in opposite directions.|Bond prices and yields must always move in the same direction.
Equity represents an ownership claim in a company.|Equity is always a guaranteed bank deposit.
SEBI regulates India's securities market.|SEBI conducts Lok Sabha elections.
Financial inclusion includes access to useful affordable financial services.|Financial inclusion means providing services only to large companies.
An NPA is a loan classified as non-performing under applicable norms.|An NPA is always a perfectly serviced loan.
Liquidity concerns the ease of meeting payment obligations or converting assets to cash.|Liquidity and profitability always mean exactly the same thing.
Digital payments can transfer value without physical cash.|Every digital payment requires a physical currency exchange at the same moment.
The lender-of-last-resort function can provide emergency liquidity to banks.|The lender-of-last-resort function is the same as passing constitutional amendments.
Deposit insurance is subject to a statutory coverage limit.|Deposit insurance guarantees every financial investment without any limit.
`),
chapter('fiscal-trade','Fiscal Policy, Trade & Agriculture','Budget, taxation, deficits, external sector and agricultural economics.',`
Fiscal policy uses government spending and taxation.|Fiscal policy is only the RBI's currency printing policy.
A fiscal deficit indicates borrowing needs after accounting for non-debt receipts.|A fiscal deficit is identical to a trade surplus.
Primary deficit excludes interest payments from fiscal deficit.|Primary deficit adds interest payments twice to fiscal deficit.
Direct taxes are imposed directly on income or other specified bases.|Every direct tax is a customs duty on imports.
GST is a tax on the supply of goods and services subject to law.|GST is a tax exclusively on agricultural rainfall.
A progressive income tax has higher rates at higher taxable-income bands.|A progressive income tax must charge everyone the same total amount.
The current account records trade in goods and services and income transfers.|The current account records only foreign purchases of shares.
Currency depreciation can make imports costlier in domestic currency.|Currency depreciation always makes every import cheaper in domestic currency.
A tariff is a duty applied to traded goods.|A tariff is a measure of forest canopy cover.
Comparative advantage depends on relative opportunity costs.|Comparative advantage requires a country to be absolutely best at everything.
MSP is announced for specified crops by the government.|MSP is automatically the legal selling price of every agricultural product.
Buffer stocks can support food security and price management.|Buffer stocks consist only of foreign currency reserves.
Crop diversification can reduce reliance on a single crop.|Crop diversification means growing only one crop forever.
Micro-irrigation can improve water-use efficiency.|Micro-irrigation requires continuous flooding of every field.
Subsidies can affect incentives and the fiscal balance.|Subsidies have no effect on producer or consumer incentives.
`),
chapter('social','Poverty, Inclusion & Social Development','Human development, health, education, demographics and sustainable livelihoods.',`
Multidimensional poverty considers deprivations beyond income alone.|Multidimensional poverty is measured exclusively by the stock index.
Human development includes health, education and living standards.|Human development is defined only by military expenditure.
Literacy and educational attainment are related but different measures.|Literacy and university completion mean exactly the same thing.
Infant mortality concerns deaths before the first birthday.|Infant mortality concerns deaths only after age sixty.
A demographic dividend depends partly on productive employment opportunities.|A larger working-age share guarantees prosperity without jobs or skills.
Social protection can help households manage risks.|Social protection necessarily excludes all vulnerable households.
Nutrition depends on food intake as well as health and care conditions.|Nutrition is determined only by calorie intake irrespective of disease.
Public health includes preventive measures such as sanitation.|Public health consists only of individual hospital surgery.
Gender disparities can affect access to education and work.|Gender disparities cannot affect economic participation.
Self-help groups can promote savings and access to credit.|Self-help groups are constitutionally identical to the Supreme Court.
Sustainable development considers present and future generations.|Sustainable development requires ignoring future resource needs.
The Sustainable Development Goals form a set of 17 goals.|The Sustainable Development Goals consist of only three military goals.
School enrolment alone does not establish learning outcomes.|Every enrolled child necessarily achieves identical learning outcomes.
The informal sector includes activities outside many formal regulatory arrangements.|The informal sector consists exclusively of multinational stock exchanges.
Accessibility can improve participation by persons with disabilities.|Accessibility means creating additional barriers to public services.
`)]},
{id:'environment',name:'Environment & Ecology',short:'Environment',paper:'GS I',color:'#8eb86e',syllabus:'Environmental ecology, biodiversity and climate change requiring no subject specialisation.',chapters:[
chapter('ecology','Ecology & Ecosystems','Energy flow, food webs, succession, nutrient cycles and habitats.',`
An ecosystem includes organisms and their physical environment.|An ecosystem includes only animals and never physical surroundings.
Producers convert energy into organic matter.|Producers obtain all their energy by eating herbivores.
Energy flow through an ecosystem is broadly unidirectional.|Energy is perfectly recycled without loss at every trophic transfer.
Food webs link multiple food chains.|A food web must consist of exactly one linear chain.
Decomposers contribute to nutrient recycling.|Decomposers prevent all nutrient recycling.
Biomagnification can increase concentrations of persistent pollutants at higher trophic levels.|Biomagnification always reduces pollutant concentration at higher trophic levels.
An ecological niche includes the functional role of an organism.|An ecological niche means only the organism's body colour.
Carrying capacity depends on environmental conditions and resources.|Carrying capacity is always infinite.
Ecological succession describes changes in community composition over time.|Ecological succession means the election of a new village head.
Nitrogen fixation converts atmospheric nitrogen into usable compounds.|Nitrogen fixation converts all soil nitrogen into oxygen gas.
Eutrophication can follow excessive nutrient enrichment of water.|Eutrophication is caused only by the complete absence of nutrients.
Wetlands can help regulate floods and filter pollutants.|Wetlands have no role in water regulation.
Mangroves are adapted to saline coastal conditions.|Mangroves require permanent alpine snow cover.
Predator removal can alter food-web relationships.|Predator removal can never affect prey populations.
The pyramid of energy is upright when energy transfer is measured over time.|The pyramid of energy is always inverted.
`),
chapter('biodiversity','Biodiversity & Conservation','Species, protected areas, conservation approaches and international agreements.',`
Biodiversity includes genetic, species and ecosystem diversity.|Biodiversity means only the total number of zoo cages.
Endemic species have a restricted natural geographic distribution.|Every endemic species is naturally found on every continent.
In-situ conservation protects species in their natural habitats.|In-situ conservation means storing only seeds in distant laboratories.
Ex-situ conservation occurs outside a species' natural habitat.|Ex-situ conservation requires all animals to remain in their original forest.
Habitat fragmentation can isolate populations.|Habitat fragmentation always connects all populations more closely.
Invasive alien species can threaten native biodiversity.|Every introduced species is automatically harmless to native ecosystems.
IUCN Red List categories assess extinction risk.|IUCN Red List categories are parliamentary tax slabs.
CITES regulates international trade in listed species.|CITES regulates only domestic income tax returns.
The Ramsar Convention concerns wetlands.|The Ramsar Convention concerns only nuclear weapons.
The Convention on Biological Diversity addresses conservation and sustainable use.|The Convention on Biological Diversity prohibits all biodiversity research.
Wildlife corridors can support movement between habitats.|Wildlife corridors are built only to isolate all animals permanently.
Keystone species can have effects disproportionate to their abundance.|Keystone species are always the most numerous species in an ecosystem.
Sacred groves can contribute to local biodiversity conservation.|Sacred groves have no vegetation by definition.
Seed banks are an example of ex-situ conservation.|Seed banks are an example of ocean tide measurement.
Protected-area effectiveness depends on management as well as designation.|Legal designation alone guarantees that every species is fully protected.
`),
chapter('climate','Climate Change & Pollution','Greenhouse gases, mitigation, adaptation, pollution and environmental policy.',`
Carbon dioxide absorbs outgoing infrared radiation.|Carbon dioxide has no role in the greenhouse effect.
Methane is a greenhouse gas.|Methane is the main protective gas in the ozone layer.
Mitigation seeks to reduce emissions or increase removals.|Mitigation means only adapting houses to floodwater without changing emissions.
Adaptation reduces vulnerability to climate impacts.|Adaptation necessarily eliminates every greenhouse gas emission.
The Paris Agreement operates under the UNFCCC.|The Paris Agreement established the Indian Supreme Court.
NDCs describe nationally determined climate contributions.|NDCs are identical uniform targets imposed on every country without national determination.
Ozone in the stratosphere helps absorb harmful ultraviolet radiation.|Stratospheric ozone mainly causes ocean tides.
The Montreal Protocol addresses ozone-depleting substances.|The Montreal Protocol was created only to regulate stock markets.
Fine particulate matter can penetrate deeply into the respiratory system.|Fine particulate matter cannot enter the human respiratory system.
Acid rain can result from emissions of sulphur dioxide and nitrogen oxides.|Acid rain is caused only by oxygen and helium.
Renewable electricity can reduce reliance on fossil fuels.|Renewable electricity generation always consumes coal as its only fuel.
Ocean acidification is linked to increased uptake of carbon dioxide.|Ocean acidification is caused solely by the Moon's gravity.
Environmental impact assessment examines likely project impacts.|Environmental impact assessment guarantees that every project has zero impact.
The polluter-pays principle assigns pollution costs to the polluter.|The polluter-pays principle requires only pollution victims to pay.
Climate and weather describe different time scales.|A single cold day disproves every long-term warming trend.
`)]},
{id:'science',name:'General Science & Technology',short:'Science',paper:'GS I',color:'#7f9cde',syllabus:'General science and relevant scientific and technological developments.',chapters:[
chapter('general-science','Biology, Chemistry & Physics','Cells, health, materials, energy, light, electricity and scientific reasoning.',`
DNA stores hereditary information in cellular organisms.|DNA is only a digestive enzyme in the stomach.
Mitochondria are involved in aerobic cellular respiration.|Mitochondria are the sole storage site of all human genetic information.
Antibiotics target bacteria rather than directly treating all viral infections.|Antibiotics directly cure every viral infection.
Vaccination can train immune responses.|Vaccination works solely by increasing body temperature permanently.
Photosynthesis uses light energy to produce organic compounds.|Photosynthesis occurs only in animals eating plants.
Enzymes act as biological catalysts.|Enzymes always slow all biological reactions.
An atom's atomic number equals its number of protons.|An atom's atomic number equals its number of neutrons alone.
Isotopes have the same proton number but different neutron numbers.|Isotopes always have different proton numbers.
An acidic aqueous solution has pH below 7 at ordinary reference conditions.|An acidic aqueous solution always has pH above 14.
Oxidation involves loss of electrons.|Oxidation always means gain of electrons.
Electric current is a rate of flow of electric charge.|Electric current is measured only in kilograms.
Sound requires a material medium to propagate.|Sound travels through a perfect vacuum in the same way as light.
Refraction involves a change in light propagation across media.|Refraction is the splitting of an atomic nucleus.
Nuclear fission splits a heavy nucleus into lighter nuclei.|Nuclear fission means combining two light nuclei into a heavier one.
A scientific hypothesis should be testable against evidence.|A scientific hypothesis must be immune to all possible tests.
`),
chapter('technology','Space, Digital & Emerging Technology','Satellites, biotechnology, computing, cybersecurity and energy technology.',`
A geostationary satellite orbits above the equator.|A geostationary satellite follows a polar orbit.
Remote sensing obtains information without direct physical contact with the target.|Remote sensing always requires touching every object being observed.
Navigation satellites provide positioning and timing signals.|Navigation satellites function only as ocean fishing nets.
Launch vehicles carry payloads into space.|Launch vehicles are only underground irrigation pumps.
CRISPR-based tools can be used for targeted genome editing.|CRISPR is solely a satellite navigation frequency.
PCR amplifies selected DNA sequences.|PCR amplifies only electric power in transmission lines.
Artificial intelligence systems can learn patterns from data.|Every artificial intelligence output is guaranteed to be correct.
Encryption transforms information to protect confidentiality.|Encryption necessarily makes information freely readable by everyone.
Phishing uses deceptive messages to obtain sensitive information.|Phishing is a method of measuring ocean salinity.
Semiconductors have controllable electrical conductivity.|Semiconductors always conduct better than every metal under all conditions.
Lithium-ion batteries store energy electrochemically.|Lithium-ion batteries produce energy solely through nuclear fission.
Green hydrogen can be produced by electrolysis using renewable electricity.|Green hydrogen is defined as hydrogen produced only by burning coal without capture.
Blockchain uses linked records with cryptographic mechanisms.|Blockchain guarantees that all input information is factually true.
Quantum bits differ from classical bits in their quantum-state properties.|Quantum bits are simply water droplets in a mechanical calculator.
An mRNA vaccine provides instructions for producing an antigen.|An mRNA vaccine must rewrite the recipient's inherited DNA.
`)]},
{id:'current',name:'International Affairs',short:'World Affairs',paper:'GS I',color:'#dc8e92',syllabus:'Current events of national and international importance, connected to the static syllabus.',chapters:[
chapter('international','Organisations, Treaties & Global Issues','International institutions, cooperation, trade, seas and development.',`
The United Nations was established in 1945.|The United Nations was established in 1845.
The UN Security Council has five permanent members.|Every UN member is a permanent member of the Security Council.
The General Assembly includes all UN member states.|The General Assembly includes only the five permanent Security Council members.
The International Court of Justice is seated in The Hague.|The International Court of Justice is seated in New Delhi.
The WTO deals with rules of international trade.|The WTO administers India's state police forces.
The IMF is associated with international monetary cooperation.|The IMF administers the Olympic Games.
The World Bank supports development financing.|The World Bank is the constitutional central bank of every country.
WHO is the UN specialised agency for health.|WHO is a military alliance.
UNESCO works in education, science and culture.|UNESCO sets every country's repo rate.
ASEAN is a regional grouping in Southeast Asia.|ASEAN is a regional grouping of South American states.
The G20 is a forum for international economic cooperation.|The G20 is a chamber of the United Nations Parliament.
UNCLOS provides a framework for the law of the sea.|UNCLOS is a treaty exclusively governing outer space.
An exclusive economic zone can extend up to 200 nautical miles under UNCLOS.|Every exclusive economic zone extends exactly 2,000 nautical miles.
Diplomacy includes negotiation between states.|Diplomacy means only declaring war without communication.
Multilateral cooperation involves more than two participating parties.|Multilateral cooperation can involve only one country.
`)]},
{id:'csat',name:'CSAT · Aptitude',short:'CSAT',paper:'GS II',color:'#aaa4e3',syllabus:'Comprehension, communication, logical reasoning, decision-making, general mental ability, basic numeracy and data interpretation.',chapters:[
{id:'numeracy',name:'Numbers & Arithmetic',scope:'Percentages, ratios, averages, interest, speed and work; Class X level.',kind:'numeracy'},
{id:'reasoning',name:'Logical Reasoning & Mental Ability',scope:'Sequences, ordering, deductions, directions and analytical reasoning.',kind:'reasoning'},
{id:'data',name:'Data Interpretation & Sufficiency',scope:'Tables, comparisons, proportions, trends and sufficiency of information.',kind:'data'},
{id:'comprehension',name:'Reading Comprehension',scope:'Central ideas, inference, assumptions and the scope of an argument.',kind:'comprehension'},
{id:'decision',name:'Decision-making & Communication',scope:'Problem solving, evidence, fair process and interpersonal communication.',kind:'decision'}]}
];
export const allChapters=subjects.flatMap(s=>s.chapters.map(c=>({...c,subject:s.id,paper:s.paper})));
