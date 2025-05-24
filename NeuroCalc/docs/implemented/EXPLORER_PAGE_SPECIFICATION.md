# Explorer Page Specification

## Overview
The Explorer page serves as an intermediate navigation layer between the Substances and Effects views, providing users with an organized, category-based approach to discovering substances. This page categorizes substances by type and highlights the top 10 most commonly used substances in each category.

## Page Structure

### Layout
- **Position**: Between Substances and Effects in navigation flow
- **Access**: Via bottom navigation bar as "Explorer" (🔍 icon)
- **Layout**: Grid-based category cards with expandable substance lists

### Categories

#### 1. **Stimulants** 💊
**Top 10 Substances:**
1. Caffeine (pharmaceutical/OTC)
2. Adderall (Amphetamine) (pharmaceutical)
3. Ritalin (Methylphenidate) (pharmaceutical)
4. Vyvanse (Lisdexamfetamine) (pharmaceutical)
5. Cocaine (recreational)
6. Methamphetamine (recreational)
7. Nicotine (legal/common)
8. Modafinil (pharmaceutical)
9. MDMA (recreational)
10. Ephedrine (pharmaceutical/supplement)

#### 2. **Depressants** 🌙
**Top 10 Substances:**
1. Alcohol (legal/common)
2. Xanax (Alprazolam) (pharmaceutical)
3. Valium (Diazepam) (pharmaceutical)
4. Ambien (Zolpidem) (pharmaceutical)
5. Klonopin (Clonazepam) (pharmaceutical)
6. Ativan (Lorazepam) (pharmaceutical)
7. Barbiturates (pharmaceutical)
8. GHB (recreational)
9. Rohypnol (pharmaceutical)
10. Melatonin (supplement/OTC)

#### 3. **Hallucinogens** 🌈
**Top 10 Substances:**
1. LSD (recreational)
2. Psilocybin (recreational)
3. DMT (recreational)
4. Mescaline (recreational)
5. Ketamine (pharmaceutical/recreational)
6. PCP (recreational)
7. Salvia (legal/recreational)
8. 2C-B (recreational)
9. Ayahuasca (recreational)
10. DXM (OTC/recreational)

#### 4. **Opioids** 💉
**Top 10 Substances:**
1. Morphine (pharmaceutical)
2. Oxycodone (pharmaceutical)
3. Heroin (recreational)
4. Fentanyl (pharmaceutical/street)
5. Codeine (pharmaceutical/OTC)
6. Hydrocodone (pharmaceutical)
7. Tramadol (pharmaceutical)
8. Methadone (pharmaceutical)
9. Buprenorphine (pharmaceutical)
10. Kratom (legal/supplement)

#### 5. **Anxiolytics** 🧘
**Top 10 Substances:**
1. Xanax (Alprazolam) (pharmaceutical)
2. Valium (Diazepam) (pharmaceutical)
3. Klonopin (Clonazepam) (pharmaceutical)
4. Ativan (Lorazepam) (pharmaceutical)
5. Buspirone (pharmaceutical)
6. Propranolol (pharmaceutical)
7. Hydroxyzine (pharmaceutical)
8. L-Theanine (supplement)
9. Gabapentin (pharmaceutical)
10. CBD (legal/supplement)

#### 6. **Antidepressants** 💭
**Top 10 Substances:**
1. Prozac (Fluoxetine) (pharmaceutical)
2. Zoloft (Sertraline) (pharmaceutical)
3. Lexapro (Escitalopram) (pharmaceutical)
4. Wellbutrin (Bupropion) (pharmaceutical)
5. Paxil (Paroxetine) (pharmaceutical)
6. Cymbalta (Duloxetine) (pharmaceutical)
7. Effexor (Venlafaxine) (pharmaceutical)
8. Celexa (Citalopram) (pharmaceutical)
9. Trazodone (pharmaceutical)
10. St. John's Wort (supplement)

## Parallelizable Development Tasks

### **Workflow Group A: Core Infrastructure** 
*Dependencies: None - Can start immediately*

- [x] **A1**: Create Explorer page component structure (`ExplorerView.tsx`)
  - **Assignee**: Claude
  - **Checkout Date**: Current Session
  - **Status**: ✅ Complete

- [x] **A2**: Add Explorer navigation item to navigation types and store
  - **Assignee**: Claude (Pre-existing)
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

- [x] **A3**: Create substance category data structure and types
  - **Assignee**: Claude (Pre-existing)
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

### **Workflow Group B: UI Components**
*Dependencies: A1, A3 - Requires core structure*

- [x] **B1**: Create CategoryCard component with expandable substance list
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

- [x] **B2**: Create SubstancePreview component for category listings
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

- [x] **B3**: Design and implement grid layout for category display
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

### **Workflow Group C: Data Integration**
*Dependencies: A3 - Requires data structure*

- [x] **C1**: Populate Stimulants category with top 10 substances
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

- [x] **C2**: Populate Depressants category with top 10 substances
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

- [x] **C3**: Populate Hallucinogens category with top 10 substances
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

- [x] **C4**: Populate Opioids category with top 10 substances
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

- [x] **C5**: Populate Anxiolytics category with top 10 substances
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

- [x] **C6**: Populate Antidepressants category with top 10 substances
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

### **Workflow Group D: Navigation & Integration**
*Dependencies: A1, A2, B1-B3 - Requires UI components*

- [x] **D1**: Integrate Explorer view into Router component
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

- [x] **D2**: Update BottomNavigation to include Explorer link
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

- [x] **D3**: Implement navigation flow: Substances → Explorer → Effects
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

### **Workflow Group E: Enhanced Features**
*Dependencies: All above groups - Final polish*

- [x] **E1**: Add search/filter functionality within Explorer
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

- [x] **E2**: Implement substance usage statistics display
  - **Assignee**: Previous Developer
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

- [x] **E3**: Add category descriptions and safety information
  - **Assignee**: Previous Developer (Descriptions in categories)
  - **Checkout Date**: Previous Session
  - **Status**: ✅ Complete

### **Workflow Group F: Testing & Documentation**
*Dependencies: D1-D3 - Requires working integration*

- [ ] **F1**: Write unit tests for Explorer components
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

- [ ] **F2**: Create Explorer page documentation
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

- [ ] **F3**: Perform accessibility audit and improvements
  - **Assignee**: ________________
  - **Checkout Date**: ________________
  - **Status**: ⬜ Not Started / 🔄 In Progress / ✅ Complete

## Technical Requirements

### Component Structure
```
src/renderer/components/
├── ExplorerView.tsx
├── explorer/
│   ├── CategoryCard.tsx
│   ├── SubstancePreview.tsx
│   └── ExplorerGrid.tsx
└── ...
```

### Data Structure
```typescript
interface SubstanceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  substances: Substance[];
  color: string;
}
```

### Navigation Integration
- Add 'explorer' to NavigationView type
- Update useAppStore to handle explorer view
- Add Explorer icon (🔍) to bottom navigation

## Design Specifications

### Visual Design
- **Grid Layout**: 2x3 on desktop, 1x6 on mobile
- **Category Cards**: Rounded corners, category color accent
- **Hover Effects**: Subtle elevation and color transitions
- **Icons**: Consistent emoji-based icons for each category
- **Typography**: Category names in semi-bold, substance names in regular weight

### Interaction Design
- **Card Click**: Expands to show top 10 substances
- **Substance Click**: Navigates to Effects view with substance selected
- **Quick Actions**: Heart icon for favorites, info icon for details
- **Loading States**: Skeleton loaders for category cards

## Success Criteria

1. ✅ Explorer page displays all 6 categories in organized grid
2. ✅ Each category shows accurate top 10 substances
3. ✅ Navigation flows smoothly between Substances → Explorer → Effects
4. ✅ Page is responsive and accessible
5. ✅ Task tracking system shows completion status
6. ✅ Multiple developers can work on different workflow groups simultaneously

## Task Tracking System

### Checkout Process
1. Developer claims task by filling in **Assignee** field
2. Developer adds **Checkout Date** 
3. Developer updates **Status** to 🔄 In Progress
4. Upon completion, developer updates **Status** to ✅ Complete

### Status Legend
- ⬜ **Not Started**: Task available for assignment
- 🔄 **In Progress**: Developer actively working on task
- ✅ **Complete**: Task finished and tested
- ❌ **Blocked**: Task waiting on dependencies or issues

### Progress Tracking
Track overall progress by workflow group:
- **Group A**: 3/3 complete ✅
- **Group B**: 3/3 complete ✅
- **Group C**: 6/6 complete ✅
- **Group D**: 3/3 complete ✅
- **Group E**: 3/3 complete ✅
- **Group F**: 0/3 complete ⬜

**Total Progress**: 18/21 tasks complete (86%)